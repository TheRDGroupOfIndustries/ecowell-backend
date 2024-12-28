import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import User from "@/models/User";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  console.log(id);

  try {
    await connectToMongoDB();

    const user: any = await User.findOne({ _id: id });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error!", { status: 500 });
  }
};
