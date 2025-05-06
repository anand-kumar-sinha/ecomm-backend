import userModel from "../models/userModel.js";

const addWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const userData = await userModel.findById(userId).select("wishlist");
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    userData.wishlist.push(productId);
    await userData.save();
    res.json({
      success: true,
      message: "Product added to wishlist",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const removeWhislist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const userData = await userModel.findById(userId).select("wishlist");
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const wishlist = userData.wishlist.filter(
      (id) => id.toString() !== productId
    );
    userData.wishlist = wishlist;
    await userData.save();
    res.json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const wishlistFetch = async (req, res) => {
  try {
    const { userId, page } = req.body;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (!page) {
      page = 1;
    }
    const total = 10;
    const userData = await userModel
      .findById(userId)
      .select("wishlist")
      .populate({
        path: "wishlist",
        options: {
          skip: (parseInt(page) - 1) * total,
          limit: total,
        },
      });

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      wishlist: userData.wishlist,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { addWishlist, removeWhislist, wishlistFetch };
