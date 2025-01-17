import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from 'next/cache';
import { connectToMongoDB } from "@/lib/db";
import Order from "@/models/Order";

export const GET = async (request: NextRequest) => {
  try {
    await connectToMongoDB();

    const orders = await Order.find({});

    revalidatePath(request.url);
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    revalidatePath(request.url);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
};
