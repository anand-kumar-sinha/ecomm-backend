import { addWishlist, removeWhislist } from "../controllers/whislistController.js";
import authUser from "../middleware/auth.js";
import express from 'express'

const whislistRouter = express.Router();

whislistRouter.post("/add", authUser, addWishlist);
whislistRouter.post("/remove", authUser, removeWhislist);

export default whislistRouter;
