import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToMongoDB } from "@/lib/db";
import RecommendedProducts from "@/models/RecommendedProducts";

export const GET = async (request: NextRequest) => {
  try {
    await connectToMongoDB();

    const recommendedProducts = await RecommendedProducts.find({})
      .select("index product -_id")
      .sort("index");

    revalidatePath(request.url);

    return NextResponse.json(
      {
        message: "Recommended products fetched successfully",
        recommendedProducts,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get recommended products", success: false },
      { status: 500 }
    );
  }
};
