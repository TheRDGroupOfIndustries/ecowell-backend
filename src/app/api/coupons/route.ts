import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Coupon from "@/models/Coupon";

export const GET = async (request: NextRequest) => {
  try {
    await connectToMongoDB();

    const coupons = await Coupon.find();
    if (coupons.length === 0) {
      return NextResponse.json({ error: "No coupons found.", status: 404 });
    }

    return NextResponse.json({
      message: "Coupons retrieved successfully!",
      coupons,
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving coupons:", error);
    return NextResponse.json({
      error: "Failed to retrieve coupons",
      status: 500,
    });
  }
};
