import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";

export const GET = async (request: NextRequest) => {
  try {
    await connectToMongoDB();

    const products = await Products.find({});

    revalidatePath(request.url);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
};