import { Schema, model, models } from "mongoose";

const newArrivalProductsSchema = new Schema(
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

const NewArrivalProducts =
  models.NewArrivalProducts ||
  model("NewArrivalProducts", newArrivalProductsSchema);

export default NewArrivalProducts;
