import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { AdminValues } from "@/Types/Layout";
import { revalidatePath } from "next/cache";

export const GET = async (request: NextRequest) => {
  //   console.log("get admins");

  try {
    await connectToMongoDB();

    const admins: AdminValues[] = await Admin.find();

    if (!admins) {
      //   console.log(admins);
      return new NextResponse("No admin's collection found!", { status: 404 });
    }

    revalidatePath(request.url);

    return new NextResponse(JSON.stringify(admins), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error!", { status: 500 });
  }
};
