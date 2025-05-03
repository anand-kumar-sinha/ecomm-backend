import cors from "cors";
import connectDB from "./config/database.js";
import cloudinaryConnect from "./config/cloudinary.js";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRouter.js";
import bannerRouter from "./routes/bannerRouter.js";
import "dotenv/config";

//const cors = require('cors')

import express from "express";
import categoryRouter from "./routes/categoryRouter.js";
const app = express();

const PORT = process.env.PORT || 4000;

connectDB();
cloudinaryConnect();

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    credentials: true,
  })
);


//api endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/banner", bannerRouter);
app.use("/api/category", categoryRouter);



// Activate
app.listen(PORT, () => {
  console.log("Server Started at : " + PORT);
});
