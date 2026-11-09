import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getStoredOrders, updateStoredOrderStatus } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (signature !== expectedSignature) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);

    // Idempotent webhook event dispatch
    if (event.event === "payment.captured") {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.notes?.order_id;

      if (orderId) {
        const orders = getStoredOrders();
        const existing = orders.find((o) => o.id === orderId);
        if (existing && existing.paymentStatus !== "paid") {
          existing.paymentStatus = "paid";
          updateStoredOrderStatus(orderId, "accepted", "Razorpay Webhook (Payment Captured)");
        }
      }
    }

    return NextResponse.json({ status: "acknowledged" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
