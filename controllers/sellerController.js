import sellerModel from "../models/sellerModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import "dotenv/config";
import notificationModel from "../models/notificationModel.js";
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
    const token = createToken(seller._id);
    res.json({
      success: true,
      seller,
      token,
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

const fetchSellerOrder = async (req, res) => {
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
      .select("orders")
      .populate("orders");

    res.status(200).json({
      success: true,
      orders: seller.orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const fetchSeller = async (req, res) => {
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
      .populate("orders notifications");
    seller.password = undefined;

    const sellerData = {
      ...seller._doc,
      recentNotification: seller.notifications.slice(0, 2),
      recentOrders: seller.orders.slice(0, 2),
      notifications: seller.notifications.length,
      orders: seller.orders.length,
    };
    res.status(200).json({
      success: true,
      seller: sellerData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const fetchSellerNotification = async (req, res) => {
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
      .select("notifications")
      .populate("notifications");
    res.status(200).json({
      success: true,
      notifications: seller.notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSellerProfile = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { storeName, storeAddress, description, name, email, phone } =
      req.body;

    // Basic validation
    if (!storeName || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "Store name, name, and email are required fields",
      });
    }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    // Find and update the seller
    const updatedSeller = await sellerModel.findByIdAndUpdate(
      sellerId,
      {
        storeName,
        storeAddress,
        description,
        name,
        email,
        phone
      },
      { new: true, runValidators: true }
    );

    if (!updatedSeller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Seller profile updated successfully",
      seller: updatedSeller
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeSingleNotificationSeller = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const sellerId = req.sellerId;

    if (!sellerId || !notificationId) {
      return res.status(400).json({
        success: false,
        message: `${!sellerId ? "sellerId" : "notificationId"} is required`,
      });
    }

    const seller = await sellerModel.findById(sellerId).select("notifications");
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!seller.notifications.includes(notificationId)) {
      return res.status(404).json({
        success: false,
        message: "Notification not found in user's notifications",
      });
    }

    // Remove the notification from user's list
    seller.notifications.pull(notificationId);
    await seller.save();

    // Then delete the notification from the notification collection
    const deleted = await notificationModel.findByIdAndDelete(notificationId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification removed successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAllNotificationsSeller = async (req, res) => {
  try {
    const sellerId = req.sellerId

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const seller = await sellerModel.findById(sellerId).select("notifications");
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await notificationModel.deleteMany({ _id: { $in: seller.notifications } });

    seller.notifications = [];
    await seller.save();

    return res.status(200).json({
      success: true,
      message: "All notifications deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  signUpSeller,
  loginSeller,
  fetchSellerProduct,
  fetchSellerOrder,
  fetchSellerNotification,
  fetchSeller,
  updateSellerProfile,
  removeSingleNotificationSeller,
  deleteAllNotificationsSeller
};
