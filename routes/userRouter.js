import express from "express";
import {
  loginUser,
  registerUser,
  adminUser,
  myProfile,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.post("/admin/login", adminUser);
userRouter.post("/me",authUser, myProfile);

export default userRouter;
