import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Order from "@/models/Order";

export const PUT = async (request: NextRequest) => {
  const { user_id, order_id, updated_status } = await request.json();

  // validating updated_status value against allowed enum values
  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  if (!validStatuses.includes(updated_status)) {
    return NextResponse.json(
      { error: "Invalid status value" },
      { status: 400 }
    );
  }

  try {
    await connectToMongoDB();

    // updating order status based on user_id and order_id
    const updatedOrder = await Order.findOneAndUpdate(
      { "orders.order_info.order_id": order_id, user_id },
      { $set: { "orders.$.order_info.status": updated_status } },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order status updated successfully", updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
};
