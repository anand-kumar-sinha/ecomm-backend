import { loginSeller, signUpSeller } from "../controllers/sellerController.js";
import express from "express";

const sellerRouter = express.Router();

sellerRouter.post("/signup", signUpSeller);
sellerRouter.post("/login", loginSeller);

export default sellerRouter;
