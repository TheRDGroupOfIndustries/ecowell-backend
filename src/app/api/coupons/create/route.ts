import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Coupon from "@/models/Coupon";

export const POST = async (request: NextRequest) => {
  try {
    const {
      admin_id,

      name,
      code,
      description,
      startDate,
      endDate,
      discountType,
      discountValue,
      quantity,
      freeShipping,
      status,

      productName,
      category,
      minSpend,
      maxSpend,

      perLimit,
      perCustomer,
    } = await request.json();

    // console.log(admin_id,name,code,description,startDate,endDate,discountType,quantity,freeShipping,status,productName,category,minSpend,maxSpend,perLimit,perCustomer);

    await connectToMongoDB();

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return NextResponse.json({
        error: "This Coupon code is already in used, please provide new code!",
        status: 400,
      });
    }

    const newCoupon = new Coupon({
      admin_id,
      name,
      code,
      description,
      startDate,
      endDate,
      discountType,
      discountValue,
      quantity,
      freeShipping,
      status,
      productName,
      category,
      minSpend,
      maxSpend,
      perLimit,
      perCustomer,
    });

    await newCoupon.save();

    return NextResponse.json({
      message: "Coupon created successfully!",
      status: 200,
    });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json({ error: "Failed to create coupon", status: 500 });
  }
};
