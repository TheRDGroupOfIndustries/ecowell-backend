import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";

export const GET = async (request: NextRequest) => {
  try {
    await connectToMongoDB();

    const products = await Products.find();

    // console.log(products);

    return NextResponse.json({
      message: "Products fetched successfully",
      status: 200,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
};
