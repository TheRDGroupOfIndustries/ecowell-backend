import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Order from "@/models/Order";

export const GET = async (
  request: NextRequest,
  { params: { user_id } }: { params: { user_id: string } }
) => {
  try {
    await connectToMongoDB();

    const userOrders = await Order.findOne({ user_id });

    if (!userOrders) {
      return NextResponse.json({
        status: 404,
        message: "No User Orders found!",
      });
    }

    return NextResponse.json(userOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
};
