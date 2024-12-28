import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";

export const GET = async (request: NextRequest, { params }:{
    params: {
        sku: string;
    }
}) => {
  try {
    await connectToMongoDB();

    const { sku } = params;

    const product = await Products.findOne({ sku });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
};