import mongoose from "mongoose";
const bannerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const bannerModel =
  mongoose.models.banner || mongoose.model("banner", bannerSchema);
export default bannerModel;
