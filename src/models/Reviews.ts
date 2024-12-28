import { Schema, model, models } from 'mongoose';

// Define the ReviewSchema
const ReviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "NewProducts",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    userId:{
      type: String,
      required: true,
    },
    username:{
      type: String,
      required: true,
    },
    userAvatar:{
      type: String,
      required: true,
    },
    review_descr: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Review = models.Review || model('Review', ReviewSchema);

export default Review;