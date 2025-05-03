//routes for user login
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import "dotenv/config";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "user not registered",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
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
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//routes for userRegistration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //Checking user already exist or not

    const exists = await userModel.findOne({ email });
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

    //Hasing user Password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    return res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//routes for adminLogin
const adminUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({
        success: true,
        message: "admin Logged in successfully",
        token,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//user my-profile
const myProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

export { loginUser, registerUser, adminUser, myProfile };
