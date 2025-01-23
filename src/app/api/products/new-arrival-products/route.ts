import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToMongoDB } from "@/lib/db";
import NewArrivalProducts from "@/models/NewArrivalProducts";

export const GET = async (request: NextRequest) => {
  try {
    await connectToMongoDB();

    const newArrivalProducts = await NewArrivalProducts.find({})
      .select("index product -_id")
      .sort("index");

    revalidatePath(request.url);

    return NextResponse.json(
      {
        message: "Special offer products fetched successfully",
        newArrivalProducts,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update special offer products", success: false },
      { status: 500 }
    );
  }
};
