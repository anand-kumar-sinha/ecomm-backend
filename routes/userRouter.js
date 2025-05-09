import express from "express";
import {
  loginUser,
  registerUser,
  adminUser,
  myProfile,
  fetchUserAll,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.post("/admin/login", adminUser);
userRouter.post("/me",authUser, myProfile);
userRouter.get("/users-all",authUser, fetchUserAll);

export default userRouter;
