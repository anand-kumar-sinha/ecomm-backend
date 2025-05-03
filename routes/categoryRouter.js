import express from "express";
import { addCategory } from "../controllers/categoryController.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const categoryRouter = express.Router();

categoryRouter.post(
  "/add",
  adminAuth,
  upload.fields([{ name: "image1", maxCount: 1 }]),
  addCategory
);

export default categoryRouter;
