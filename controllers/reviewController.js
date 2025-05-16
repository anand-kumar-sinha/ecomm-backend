import productModel from "../models/productModel.js";
import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";

const addReview = async (req, res) => {
  try {
    const { title, comment, rating, userId, variant, user, location } =
      req.body;
    const { productId } = req.params;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!title || !comment || !rating || !productId || !variant || !user) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exsistinguser = await userModel
      .findById(userId)
      .select("orders")
      .populate("orders");
    if (!exsistinguser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const exsistingProduct = await productModel
      .findById(productId)
      .select("reviews");
    if (!exsistingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const hasProduct = exsistinguser.orders.some((order) =>
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
      description: comment,
      rating,
      user: userId,
      product: productId,
      userName: user,
      productName: variant,
      city: location,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Someting went wrong",
      });
    }
    await review.save();

    exsistingProduct.reviews.unshift(review._id);
    await exsistingProduct.save();

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

const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewModel.find({ product: productId });
    if (!reviews) {
      return res.status(404).json({
        success: false,
        message: "No reviews found",
      });
    }
    res.json({
      success: true,
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { addReview, getReviews };
