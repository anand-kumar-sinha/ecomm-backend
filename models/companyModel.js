import mongoose from "mongoose";
const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  referral: {
    type: String,
  },
  facebook: {
    type: String,
  },
  whatsapp: {
    type: String,
  },
  twitter: {
    type: String,
  },
  youtube: {
    type: String,
  },
  instagram: {
    type: String,
  },
  telegram: {
    type: String,
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

const companyModel =
  mongoose.models.company || mongoose.model("company", companySchema);
export default companyModel;
