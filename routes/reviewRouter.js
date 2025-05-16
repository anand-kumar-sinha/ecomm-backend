import express from "express";
import authUser from "../middleware/auth.js";
import { addReview, getReviews } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/add/:productId", authUser, addReview);
reviewRouter.get("/fetch/:productId",  getReviews);

export default reviewRouter;
