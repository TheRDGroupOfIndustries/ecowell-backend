import { Order, OrderDetails, OrderInfo } from "@/Types/Layout";
import { Product } from "@/Types/Layout";
import { Schema, model, models } from "mongoose";

const productSchema = new Schema<Product>({
  product_id: { type: Schema.Types.ObjectId, ref: "Products" },
  variant_flavor: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const orderInfoSchema = new Schema<OrderInfo>({
  order_id: { type: String, required: true },
  payment_method: {
    type: String,
    required: true,
    enum: ["online", "cash-on-delivery"],
  },
  total_price: { type: Number, required: true },

  first_name: { type: String, required: true },
  last_name: { type: String, required: true },

  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },

  order_date: { type: Date, required: true },
  delivery_date: { type: Date },
  shipping_date: { type: Date },
  cancelled_date: { type: Date },

  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
});

const orderDetailsSchema = new Schema<OrderDetails>({
  order_info: orderInfoSchema,
  products: [productSchema],
});

const orderSchema = new Schema<Order>({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  user_name: { type: String, required: true },
  orders: [orderDetailsSchema],
});

export default models.Order || model<Order>("Order", orderSchema);
