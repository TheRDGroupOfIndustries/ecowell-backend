import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import User from "@/models/User";

export const GET = async (request: NextRequest) => {
  // console.log("get users");

  try {
    await connectToMongoDB();

    const users: any = await User.find();

    if (!users) {
      //   console.log(users);
      return new NextResponse("No user's collection found!", { status: 404 });
    }

    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error!", { status: 500 });
  }
};
