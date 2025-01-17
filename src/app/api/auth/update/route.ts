import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToMongoDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { revalidatePath } from "next/cache";

export const PUT = async (request: NextRequest) => {
  try {
    const updateData = await request.json();
    const { user_id, role, ...allowedUpdates } = updateData;

    // Prevent role updates
    if (role) {
      return NextResponse.json(
        { error: "Role cannot be updated" },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    const existingUser = await Admin.findById(user_id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare update object with allowed fields
    const updates: any = {};

    // Handle standard fields
    Object.entries(allowedUpdates).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        updates[key] = value;
      }
    });

    // Special handling for password
    if (allowedUpdates.password) {
      updates.password = await bcrypt.hash(allowedUpdates.password, 10);
    }

    // Only proceed with update if there are changes
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { message: "No changes to update" },
        { status: 200 }
      );
    }

    // Perform the update
    const updatedUser = await Admin.findByIdAndUpdate(
      user_id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    revalidatePath(request.url);

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Update error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
};
