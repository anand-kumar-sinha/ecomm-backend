import cors from "cors";
import connectDB from "./config/database.js";
import cloudinaryConnect from "./config/cloudinary.js";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRouter.js";
import "dotenv/config";

//const cors = require('cors')

import express from "express";
//const express =  require('express');
const app = express();

//require("dotenv").config();
const PORT = process.env.PORT || 3000;

connectDB();
cloudinaryConnect();

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

//api endpoints

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

/*app.get("/", (req,res) => {
    res.send('Api working')
})*/

app.get("/", async (req, res, next) => {
  try {
    let html = fs.readFileSync(path.resolve(root, "index.html"), "utf-8");

    // Transform HTML using Vite plugins.
    html = await viteServer.transformIndexHtml(req.url, html);

    res.send(html);
  } catch (e) {
    return next(e);
  }
});

// Activate
app.listen(PORT, () => {
  console.log("Server Started at : " + PORT);
});
