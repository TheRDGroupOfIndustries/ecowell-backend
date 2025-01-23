import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToMongoDB } from "@/lib/db";
import NewArrivalProducts from "@/models/NewArrivalProducts";

export const PUT = async (request: NextRequest) => {
  const {
    newArrivalProducts,
  }: { newArrivalProducts: { index: number; product: string }[] } =
    await request.json();

  // console.log(newArrivalProducts);

  if (!Array.isArray(newArrivalProducts)) {
    return NextResponse.json(
      { error: "Invalid input format. Expected an array", success: false },
      { status: 400 }
    );
  }

  // Validate the input format
  // const isValidInput = newArrivalProducts.every(
  //   (item) =>
  //     typeof item.index === "number" &&
  //     typeof item.product === "string" &&
  //     mongoose.Types.ObjectId.isValid(item.product)
  // );

  // if (!isValidInput) {
  //   return NextResponse.json(
  //     {
  //       error:
  //         "Each item must have a numeric index and valid product ID string",
  //       success: false,
  //     },
  //     { status: 400 }
  //   );
  // }

  try {
    await connectToMongoDB();

    // Delete existing special offer products
    await NewArrivalProducts.deleteMany({});

    // Create new special offer products
    const newNewArrivalProducts = await NewArrivalProducts.create(
      newArrivalProducts
    );

    const populatedProducts = await NewArrivalProducts.find({}).sort("index");

    revalidatePath(request.url);

    return NextResponse.json(
      {
        message: "Special offer products updated successfully",
        data: populatedProducts,
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
