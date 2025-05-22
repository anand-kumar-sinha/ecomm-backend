import express from "express";
import authUser from "../middleware/auth.js";
import { fetchAllNotifications } from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.post("/get", authUser, fetchAllNotifications);

export default notificationRouter;
