import { Schema, model, models } from "mongoose";

const recommendedProductsSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    index: { type: Number, required: true },
  },
  { timestamps: true }
);

const RecommendedProducts =
  models.RecommendedProducts ||
  model("RecommendedProducts", recommendedProductsSchema);

export default RecommendedProducts;
