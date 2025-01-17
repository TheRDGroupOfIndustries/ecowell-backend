import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from 'next/cache';
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
      revalidatePath(request.url);
      return NextResponse.json({
        status: 404,
        message: "No User Orders found!",
      });
    }

    revalidatePath(request.url);
    return NextResponse.json(userOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    revalidatePath(request.url);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
};
