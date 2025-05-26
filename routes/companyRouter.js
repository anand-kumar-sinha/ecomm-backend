import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { fetchCompany, updateCompany } from "../controllers/companyController.js";

const companyRouter = express.Router();

companyRouter.post("/update",adminAuth, updateCompany);
companyRouter.get("/fetch", fetchCompany);

export default companyRouter;
