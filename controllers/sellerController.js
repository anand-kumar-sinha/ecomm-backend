import sellerModel from "../models/sellerModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import "dotenv/config";
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const signUpSeller = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }
    const exists = await sellerModel.findOne({ email });
    if (exists) {
      return res.json({
        success: false,
        message: "user already exists",
      });
    }
    //Vlidating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const seller = await sellerModel.create({
      name,
      email,
      password: hashedPassword,
    });
    if (!seller) {
      return res.json({
        success: false,
        message: "Something went wrong",
      });
    }
    res.json({
      success: true,
      seller,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await sellerModel.findOne({ email });

    if (!seller) {
      return res.json({
        success: false,
        message: "seller not registered",
      });
    }

    const isMatch = await bcrypt.compare(password, seller.password);

    if (isMatch) {
      const token = createToken(seller._id);
      return res.json({
        success: true,
        message: "Log in successfully",
        token,
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const fetchSellerProduct = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const seller = await sellerModel
      .findById(sellerId)
      .select("products")
      .populate({
        path: "products",
        populate: {
          path: "category subCategory",
          select: "categoryName",
        },
      });

    res.status(200).json({
      success: true,
      products: seller.products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { signUpSeller, loginSeller, fetchSellerProduct };
