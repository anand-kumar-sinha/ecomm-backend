import productModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
import sellerModel from "../models/sellerModel.js";

//Add product
const addProduct = async (req, res) => {
  try {
    const {
      // Extract the request data
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
      sellerId
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestSeller: bestSeller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    if(sellerId){
      productData.addedBy = sellerId
    }

    const product = new productModel(productData);
    await product.save();

    if(sellerId){
      const seller = await sellerModel.findById(sellerId).select("products");
      seller.products.unshift(product._id);
      await seller.save();
    }

    res.send({
      success: true,
      message: "Product Added",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//List product
const listProductBestSeller = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [products, totalProducts] = await Promise.all([
      productModel
        .find({ bestSeller: true })
        .populate({ path: "category", select: "categoryName" })
        .populate({ path: "subCategory", select: "categoryName" })
        .skip(skip)
        .limit(limit),
      productModel.countDocuments(),
    ]);

    res.json({
      success: true,
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//Remove product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({
      success: true,
      message: "Product removed",
    });
  } catch (error) {
    console.log(error),
      res.json({
        success: false,
        message: error.message,
      });
  }
};

//Single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const fetchProductByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    if (!categoryId) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const filter = {
      $or: [{ category: categoryId }, { subCategory: categoryId }],
    };

    const [products, totalProducts] = await Promise.all([
      productModel.find(filter).skip(skip).limit(limit),
      productModel.countDocuments(filter),
    ]);

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Product found",
      });
    }

    res.json({
      success: true,
      message: "Products fetched successfully",
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchProduct = async (req, res) => {
  try {
    const { key, page } = req.query;

    // Validate key
    if (!key || typeof key !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search key must be a valid string",
      });
    }

    const pageNumber = parseInt(page) || 1;
    const limit = 6;
    const skip = (pageNumber - 1) * limit;

    const products = await productModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subCategoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$subCategoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { name: { $regex: key, $options: "i" } },
            { description: { $regex: key, $options: "i" } },
            { "categoryDetails.categoryName": { $regex: key, $options: "i" } },
            { "subCategoryDetails.categoryName": { $regex: key, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          name: 1,
          price: 1,
          image: 1,
          bestSeller: 1,
          categoryDetails: 1,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    // Count total documents matching the search (without pagination)
    const totalCountAgg = await productModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subCategoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$subCategoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { name: { $regex: key, $options: "i" } },
            { description: { $regex: key, $options: "i" } },
            { "categoryDetails.categoryName": { $regex: key, $options: "i" } },
            { "subCategoryDetails.categoryName": { $regex: key, $options: "i" } },
          ],
        },
      },
      {
        $count: "totalCount",
      },
    ]);

    const totalCount = totalCountAgg[0]?.totalCount || 0;

    res.json({
      success: true,
      message: "Products fetched successfully",
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / limit),
      totalResults: totalCount,
      products,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const listProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const [products, totalProducts] = await Promise.all([
      productModel
        .find({})
        .populate({ path: "category", select: "categoryName" })
        .populate({ path: "subCategory", select: "categoryName" })
        .skip(skip)
        .limit(limit),
      productModel.countDocuments(),
    ]);

    res.json({
      success: true,
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  listProductBestSeller,
  addProduct,
  singleProduct,
  removeProduct,
  fetchProductByCategory,
  searchProduct,
  listProduct,
};
