import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createOrder } from "@/lib/actions/order.actions";
import mongoose from "mongoose";

const GET_API_KEY = () => {
  const key = process.env.CHARGILY_SECRET_KEY;
  if (!key) throw new Error("Chargily API key is not provided");
  return key;
};

export async function POST(request: NextRequest) {
  const signature = request.headers.get("Signature");
  const payload = await request.json();

  if (!signature) {
    return NextResponse.json({
      status: "failed",
      message: "Missing signature",
    });
  }

  const computedSignature = crypto
    .createHmac("sha256", GET_API_KEY())
    .update(JSON.stringify(payload))
    .digest("hex");

  if (computedSignature !== signature) {
    return NextResponse.json({
      status: "failed",
      message: "Invalid signature",
    });
  }

  const { eventId, buyerId, totalAmount } = payload;

  try {
    await createOrder({
      eventId: new mongoose.Types.ObjectId(eventId),
      userId: new mongoose.Types.ObjectId(buyerId),
      totalAmount,
      createdAt: new Date(),
    });

    return NextResponse.json({
      status: "success",
      message: "Order created successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: "failed",
      message: "Order creation failed",
    });
  }
}