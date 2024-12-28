import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";

export const DELETE = async (request: NextRequest, { params }: { params: { sku: string } }) => {
    const { sku } = params;
    try {
      await connectToMongoDB();
  
      const product = await Products.findOneAndDelete({ sku });
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { message: "Product deleted successfully!" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json(
        { error: "Failed to delete product" },
        { status: 500 }
      );
    }
  };