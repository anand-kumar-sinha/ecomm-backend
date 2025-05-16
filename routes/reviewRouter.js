import express from "express";
import authUser from "../middleware/auth.js";
import { addReview } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/add/:productId", authUser, addReview);

export default reviewRouter;
