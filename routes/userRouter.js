import express from 'express';
import {loginUser,registerUser, adminUser} from '../controllers/userController.js'

const userRouter = express.Router();

userRouter.post('/login',loginUser)
userRouter.post('/register',registerUser)
userRouter.post('/admin/login',adminUser)



export default userRouter;