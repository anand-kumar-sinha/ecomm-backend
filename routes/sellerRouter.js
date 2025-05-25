import { loginSeller, signUpSeller } from "../controllers/sellerController.js";
import express from "express";
import authSeller from "../middleware/sellerAuth.js";
import { addProduct } from "../controllers/productController.js";
import upload from "../middleware/multer.js";

const sellerRouter = express.Router();

sellerRouter.post("/signup", signUpSeller);
sellerRouter.post("/login", loginSeller);
sellerRouter.post(
  "/add",
  authSeller,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
export default sellerRouter;
