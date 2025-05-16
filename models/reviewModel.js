import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  userName: {
    type: String,
  },
  productName: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  city:{
    type:String
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const reviewModel =
  mongoose.models.review || mongoose.model("reivew", reviewSchema);
export default reviewModel;
