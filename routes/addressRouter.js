import express from "express";
import authUser from "../middleware/auth.js";
import { addAddress } from "../controllers/addressController.js";

const addressRouter = express.Router();

addressRouter.post(
  "/add",
  authUser,
  addAddress
);

// bannerRouter.get("/fetch", fetchBanner);
// bannerRouter.post("/delete",adminAuth, deleteBanner);

export default addressRouter;
