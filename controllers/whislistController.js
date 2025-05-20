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

    if (userData.whislist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product already added to wishlist",
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
    const whislist = userData.whislist.filter(
      (id) => id.toString() !== productId
    );
    userData.whislist = whislist;
    await userData.save();
    res.json({
      success: true,
      message: "Product removed from whislist",
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
    const { userId } = req.body;
    let page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // First fetch only the wishlist array length for pagination
    const userForCount = await userModel.findById(userId).select("whislist");
    if (!userForCount) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const totalWishlistItems = userForCount.whislist.length;
    const totalPages = Math.ceil(totalWishlistItems / limit);

    // Now fetch the paginated wishlist items
    const userData = await userModel
      .findById(userId)
      .select("whislist")
      .populate({
        path: "whislist",
        options: {
          skip,
          limit,
        },
      });

    res.json({
      success: true,
      message: "Wishlist fetched successfully",
      wishlist: userData.whislist,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export { addWishlist, removeWhislist, fetchWishlist };
