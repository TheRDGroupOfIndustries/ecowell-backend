import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import { Categories } from "@/models/Categories";

// GET: Retrieve all categories
export const GET = async () => {
  try {
    await connectToMongoDB();

    const categories = await Categories.find();

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
};