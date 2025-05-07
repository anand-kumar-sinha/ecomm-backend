import express from "express";
import {
  addCategory,
  deleteCategory,
  fetchCategory,
  fetchCategoryAll,
} from "../controllers/categoryController.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const categoryRouter = express.Router();

categoryRouter.post(
  "/add",
  adminAuth,
  upload.fields([{ name: "image1", maxCount: 1 }]),
  addCategory
);
categoryRouter.get("/fetch", fetchCategory);
categoryRouter.get("/fetch/all", fetchCategoryAll);
categoryRouter.post("/delete", adminAuth, deleteCategory);

export default categoryRouter;
