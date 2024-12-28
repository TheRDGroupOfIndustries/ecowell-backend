import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Product from "@/models/Products";
import Order from "@/models/Order";
import User from "@/models/User";

export const GET = async (request: NextRequest) => {
  try {
    await connectToMongoDB();

    const products = await Product.find();
    const orders = await Order.find();
    const users = await User.find();

    if (!products || !orders || !users) {
      // console.log(products, orders, users);

      return NextResponse.json(
        {
          error: !products
            ? "Products collection not found"
            : !orders
            ? "Orders collection not found"
            : !users
            ? "Users collection not found"
            : "Collection not found",
        },
        { status: 404 }
      );
    }

    const totalSales = orders.reduce(
      (sum: number, order) =>
        sum +
        order.orders.reduce(
          (orderSum: number, orderDetail: any) =>
            orderSum + orderDetail.order_info.total_price,
          0
        ),
      0
    );

    // Calculate total length of all user's orders
    const totalUserOrdersLength = await Promise.all(
      users.map(async (user) => {
        const userOrders = await Order.find({ user_id: user._id });
        return userOrders.reduce(
          (total, order) => total + order.orders.length,
          0
        );
      })
    ).then((lengths) => lengths.reduce((a, b) => a + b, 0));

    const collectionsLength = {
      products: products.length,
      orders: totalUserOrdersLength,
      users: users.length,
      totalSales: totalSales,
    };
    return NextResponse.json(collectionsLength, { status: 200 });
  } catch (error) {
    console.error("Error retrieving coupons:", error);
    return NextResponse.json({
      error: "Failed to retrieve coupons",
      status: 500,
    });
  }
};
