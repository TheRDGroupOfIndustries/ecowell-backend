import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    image_link: { type: String, required: true },
  },
  { timestamps: true }
);

const Categories = models.Categories || model("Categories", CategorySchema);

export { Categories };
