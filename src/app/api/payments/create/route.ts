import { NextRequest, NextResponse } from "next/server";
import { getStoredSettings } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount } = await req.json();

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: "orderId and amount (in paise) are required" },
        { status: 400 }
      );
    }

    const settings = getStoredSettings();

    // Check if live Razorpay credentials are set in environment
    const keyId = process.env.RAZORPAY_KEY_ID || settings.razorpayKeyId;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || settings.isTestPaymentMode) {
      // Return Test Mode configuration
      return NextResponse.json({
        isTestMode: true,
        orderId,
        currency: "INR",
        amount,
        message: "Operating in simulated development/test payment mode. No real bank charges applied.",
        mockGatewayUrl: `/order/success/${orderId}?status=paid_simulated`,
      });
    }

    // When real credentials exist, call Razorpay Orders API:
    // const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    // const res = await fetch("https://api.razorpay.com/v1/orders", { ... });

    return NextResponse.json({
      isTestMode: false,
      razorpayOrderId: `order_live_${Date.now()}`,
      currency: "INR",
      amount,
      keyId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
