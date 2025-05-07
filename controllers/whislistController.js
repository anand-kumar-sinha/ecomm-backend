import userModel from "../models/userModel.js";

const addWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if(!userId){
        return res.status(404).json({
            success:false,
            message:"User not found"
        })
    }
    if(!productId){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }
    const userData = await userModel.findById(userId).select("whislist");
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    userData.whislist.unshift(productId);
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
    const userData = await userModel.findById(userId).select("whislist");
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

const fetchWishlist = async (req, res) => {
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
        path: "whislist",
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
      whislist: userData.whislist,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { addWishlist, removeWhislist, fetchWishlist };
