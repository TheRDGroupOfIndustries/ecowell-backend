import { Types } from "mongoose";

export const sampleOrders = Array.from({ length: 20 }, (_, userIndex) => ({
  user_id: new Types.ObjectId(),
  user_name: `User${userIndex + 1}`,
  orders: Array.from(
    { length: Math.floor(Math.random() * 3) + 1 },
    (_, orderIndex) => ({
      order_info: {
        order_id: `ORD${userIndex + 1}-${orderIndex + 1}`,
        payment_method: "online",
        total_price: Math.floor(Math.random() * 1000) + 1,
        first_name: `FirstName${userIndex + 1}`,
        last_name: `LastName${userIndex + 1}`,
        phone: `+91987654321${userIndex}`,
        email: `user${userIndex + 1}@example.com`,
        address: `Address ${userIndex + 1}`,
        country: "CountryName",
        state: "StateName",
        city: "CityName",
        pincode: `ZIP${userIndex + 1}`,
        order_date: new Date(
          Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000 // Random order date within the past 30 days
        ),
        delivery_date: new Date(
          Date.now() + Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000 // Random delivery date within the next 10 days
        ),
        shipping_date: new Date(
          Date.now() + Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000 // Random shipping date within the next 5 days
        ),
        cancelled_date: Math.random() > 0.8 ? new Date() : null, // 20% chance of a cancelled date
        status: ["pending", "processing", "shipped", "delivered", "cancelled"][
          Math.floor(Math.random() * 5)
        ],
      },
      products: Array.from(
        { length: Math.floor(Math.random() * 5) + 1 },
        () => ({
          product_id: new Types.ObjectId(),
          variant_flavor: `Flavor ${Math.floor(Math.random() * 10) + 1}`,
          quantity: Math.floor(Math.random() * 10) + 1,
        })
      ),
    })
  ),
}));
