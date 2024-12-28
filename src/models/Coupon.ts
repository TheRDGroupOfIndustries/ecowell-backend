import { Schema, model, models } from "mongoose";

const couponSchema: Schema = new Schema(
  {
    admin_id: { type: Schema.Types.ObjectId, ref: "Admin" },
    // general
    name: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String, required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    discountType: { type: String, required: true },
    discountValue: { type: Number, required: true, default: 0 },
    quantity: { type: Number, required: true, default: 1 },
    freeShipping: { type: Boolean, required: true, default: false },
    status: { type: Boolean, required: true, default: false },

    // restriction
    productName: { type: String, required: false },
    category: { type: String, required: false },
    minSpend: { type: Number, required: true, default: 0 },
    maxSpend: { type: Number, required: true, default: 0 },

    // usage
    perLimit: { type: Number, required: true, default: 0 },
    perCustomer: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Coupnon = models.Coupon || model("Coupon", couponSchema);
export default Coupnon;
