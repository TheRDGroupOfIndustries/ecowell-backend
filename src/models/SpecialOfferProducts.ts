import { Schema, model, models } from "mongoose";

const specialOfferProductsSchema = new Schema(
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

const SpecialOfferProducts =
  models.SpecialOfferProducts ||
  model("SpecialOfferProducts", specialOfferProductsSchema);

export default SpecialOfferProducts;
