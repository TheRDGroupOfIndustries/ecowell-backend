import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import { Categories } from "@/models/Categories";

// GET: Retrieve a single category by ID
export const GET = async (request: NextRequest, { params }:{
    params: {
        id: string;
    }
}) => {
  try {
    const { id } = params;
    await connectToMongoDB();

    const category = await Categories.findById(id);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
};

// PUT: Update a single category by ID
export const PUT = async (request: NextRequest, { params }:{
    params: {
        id: string;
    }
}) => {
  try {
    const { id } = params;
    const { title, slug, image } = await request.json();
    console.log("Received category update:", { title, slug, image });

    await connectToMongoDB();

    const updatedCategory = await Categories.findByIdAndUpdate(
      id,
      { title, slug, image },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Category updated successfully!", category: updatedCategory },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
};

// DELETE: Delete a single category by ID
export const DELETE = async (request: NextRequest, { params }:{
    params: {
        id: string;
    }
}) => {
  try {
    const { id } = params;
    await connectToMongoDB();

    const deletedCategory = await Categories.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Category deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
};