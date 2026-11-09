import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  calculateOrderPricing,
  formatCurrency,
  generateOrderNumber,
  generateTrackingToken,
  validatePincode,
} from "@/lib/utils";
import {
  createStoredOrder,
  getCouponByCode,
  getStoredProducts,
  getStoredSettings,
} from "@/lib/store";
import { Order, OrderStatus } from "@/types";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().min(10, "Valid phone number required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  fulfilmentType: z.enum(["delivery", "pickup"]),
  paymentMethod: z.enum(["cod", "upi", "card", "netbanking"]),
  deliveryTiming: z.enum(["asap", "scheduled"]).default("asap"),
  scheduledSlot: z.string().optional(),
  couponCode: z.string().optional(),
  address: z
    .object({
      line1: z.string().min(3),
      line2: z.string().optional(),
      landmark: z.string().optional(),
      city: z.string().default("Gurugram"),
      state: z.string().default("Haryana"),
      pincode: z.string().length(6),
      deliveryInstructions: z.string().optional(),
    })
    .optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      addonIds: z.array(z.string()).default([]),
      quantity: z.number().int().positive(),
      itemNotes: z.string().optional(),
    })
  ).min(1, "Cart cannot be empty"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerPhone,
      customerEmail,
      fulfilmentType,
      paymentMethod,
      deliveryTiming,
      scheduledSlot,
      couponCode,
      address,
      items: submittedItems,
    } = parsed.data;

    const settings = getStoredSettings();
    const allProducts = getStoredProducts();

    // 1. Verify restaurant status
    if (!settings.isAcceptingOrders) {
      return NextResponse.json(
        { error: "Kitchen is temporarily not accepting online orders." },
        { status: 400 }
      );
    }

    // 2. Verify delivery address and service pincodes
    if (fulfilmentType === "delivery") {
      if (!address || !address.line1) {
        return NextResponse.json(
          { error: "Delivery address is required for home delivery orders." },
          { status: 400 }
        );
      }
      if (!validatePincode(address.pincode, settings.servicePincodes)) {
        return NextResponse.json(
          {
            error: `Delivery is currently not available to pincode ${address.pincode}. Served pincodes: ${settings.servicePincodes.join(", ")}`,
          },
          { status: 400 }
        );
      }
    }

    // 3. Server-side product availability and price re-verification
    const resolvedCartItems = [];
    for (const item of submittedItems) {
      const product = allProducts.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Item "${item.productId}" no longer exists in our menu.` },
          { status: 400 }
        );
      }
      if (!product.isAvailable) {
        return NextResponse.json(
          { error: `"${product.name}" is sold out. Please remove or update your order.` },
          { status: 400 }
        );
      }

      // Check variant
      let selectedVariantObj = undefined;
      let variantDelta = 0;
      if (item.variantId && product.variants) {
        const v = product.variants.find((varItem) => varItem.id === item.variantId);
        if (v) {
          selectedVariantObj = { id: v.id, name: v.name, priceDelta: v.priceDelta };
          variantDelta = v.priceDelta;
        }
      }

      // Check addons
      const selectedAddonObjs = [];
      let addonsDelta = 0;
      if (item.addonIds.length > 0 && product.addons) {
        for (const aId of item.addonIds) {
          const add = product.addons.find((addOn) => addOn.id === aId && addOn.isActive);
          if (add) {
            selectedAddonObjs.push({ id: add.id, name: add.name, price: add.price });
            addonsDelta += add.price;
          }
        }
      }

      const unitPrice = product.basePrice + variantDelta + addonsDelta;
      resolvedCartItems.push({
        id: `${product.id}_${item.variantId || "std"}`,
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl,
        dietaryType: product.dietaryType,
        basePrice: product.basePrice,
        selectedVariant: selectedVariantObj,
        selectedAddons: selectedAddonObjs,
        quantity: item.quantity,
        itemNotes: item.itemNotes,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      });
    }

    // 4. Server-side coupon verification
    const coupon = couponCode ? getCouponByCode(couponCode) : undefined;
    const pricing = calculateOrderPricing(resolvedCartItems, coupon, fulfilmentType, settings);

    if (pricing.couponError && couponCode) {
      return NextResponse.json({ error: pricing.couponError }, { status: 400 });
    }

    if (!pricing.isEligibleForDelivery) {
      return NextResponse.json(
        {
          error: `Minimum order amount of ${formatCurrency(settings.minimumOrderValue)} required.`,
        },
        { status: 400 }
      );
    }

    // 5. Generate secure order
    const orderId = `ord-${Date.now()}`;
    const orderNumber = generateOrderNumber();
    const guestTrackingToken = generateTrackingToken();

    const orderPayload: Order = {
      id: orderId,
      orderNumber,
      guestName: customerName,
      guestPhone: customerPhone,
      guestEmail: customerEmail || undefined,
      fulfilmentType,
      status: "placed",
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      subtotal: pricing.subtotal,
      discountTotal: pricing.discountTotal,
      deliveryFee: pricing.deliveryFee,
      taxTotal: pricing.taxTotal,
      packagingFee: pricing.packagingFee,
      grandTotal: pricing.grandTotal,
      couponCode: pricing.appliedCoupon?.code,
      addressSnapshot: fulfilmentType === "delivery" ? address : undefined,
      customerNotes:
        deliveryTiming === "scheduled"
          ? `[Scheduled Slot: ${scheduledSlot}]`
          : undefined,
      guestTrackingToken,
      estimatedDeliveryMinutes: settings.defaultPrepTimeMinutes + (fulfilmentType === "delivery" ? 20 : 0),
      placedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: resolvedCartItems.map((item) => ({
        id: `snap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: item.productId,
        productNameSnapshot: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
        variantSnapshot: item.selectedVariant
          ? { name: item.selectedVariant.name, priceDelta: item.selectedVariant.priceDelta }
          : undefined,
        addonsSnapshot: item.selectedAddons.map((a) => ({ name: a.name, price: a.price })),
        itemNotes: item.itemNotes,
      })),
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          newStatus: "placed",
          changedBy: "Customer Online Checkout",
          timestamp: new Date().toISOString(),
          note: "Order confirmed by server calculation engine",
        },
      ],
    };

    createStoredOrder(orderPayload);

    return NextResponse.json({
      success: true,
      orderId: orderPayload.id,
      orderNumber: orderPayload.orderNumber,
      trackingToken: orderPayload.guestTrackingToken,
      grandTotal: orderPayload.grandTotal,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal order processing error", message: error.message },
      { status: 500 }
    );
  }
}
