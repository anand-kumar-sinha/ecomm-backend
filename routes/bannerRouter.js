import express from "express";
import { addBanner, deleteBanner, fetchBanner } from "../controllers/bannerController.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const bannerRouter = express.Router();

bannerRouter.post(
  "/add",
  adminAuth,
  upload.fields([{ name: "image1", maxCount: 1 }]),
  addBanner
);

bannerRouter.get("/fetch", fetchBanner);
bannerRouter.post("/delete",adminAuth, deleteBanner);

export default bannerRouter;
