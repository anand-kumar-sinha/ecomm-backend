import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    storeName: {
      type: String,
    },
    storeAddress: {
      type: String,
    },
    description: {
      type: String,
    },
    phone:{
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "seller",
    },
    totalSells: {
      type: Number,
      default: 0,
    },
    totalEarning: {
      type: Number,
      default: 0,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
      },
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "notification",
      },
    ],
  },
  { minimize: false }
);

const sellerModel =
  mongoose.models.seller || mongoose.model("seller", sellerSchema);
export default sellerModel;
