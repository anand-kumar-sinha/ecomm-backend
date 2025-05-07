import express from "express";
import authUser from "../middleware/auth.js";
import { addAddress, fetchAddreses } from "../controllers/addressController.js";

const addressRouter = express.Router();

addressRouter.post(
  "/add",
  authUser,
  addAddress
);

addressRouter.get("/fetch",authUser, fetchAddreses);
// addressRouter.post("/delete",adminAuth, deleteBanner);

export default addressRouter;
