import express from "express";
import authUser from "../middleware/auth.js";
import { deleteAllNotifications, fetchAllNotifications, removeSingleNotification } from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.post("/get", authUser, fetchAllNotifications);
notificationRouter.post("/delete", authUser, removeSingleNotification);
notificationRouter.post("/delete/all", authUser, deleteAllNotifications);

export default notificationRouter;
