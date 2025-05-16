import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";

const addReview = async (req, res) => {
  try {
    const { title, description, rating, productId, userId } = req.body;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!title || !description || !rating || !productId) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await userModel.findById(userId).select("orders");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hasProduct = user.orders.some((order) =>
      order.items?.some((item) => item.productId.toString() === productId)
    );

    if (!hasProduct) {
      return res.status(404).json({
        success: false,
        message: "You have not ordered this product",
      });
    }

    const review = await reviewModel.create({
      title,
      description,
      rating,
      user: userId,
      product: productId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Someting went wrong",
      });
    }

    await review.save();
    res.json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


export { addReview };