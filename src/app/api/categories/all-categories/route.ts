import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToMongoDB } from "@/lib/db";
import { Categories } from "@/models/Categories";

export const GET = async (request: Request) => {
  try {
    await connectToMongoDB();

    const categories = await Categories.find();

    revalidatePath(request.url);
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
};
