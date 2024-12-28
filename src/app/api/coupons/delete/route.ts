import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Coupon from "@/models/Coupon";

export const DELETE = async (request: NextRequest) => {
  try {
    await connectToMongoDB();

    const { ids } = await request.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No coupon IDs provided." },
        { status: 400 }
      );
    }

    const result = await Coupon.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      const deletedIds = ids; // all _id's are considered not deleted since none were deleted
      if (deletedIds.length > 0) {
        return NextResponse.json(
          { error: "No coupons found to delete.", notDeleted: deletedIds },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Coupons deleted successfully!",
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting coupons:", error);
    return NextResponse.json(
      { error: "Failed to delete coupons" },
      { status: 500 }
    );
  }
};
