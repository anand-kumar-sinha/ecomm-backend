import categoryModel from "../models/categoryModel.js";
import { v2 as cloudinary } from "cloudinary";
const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];

    if (!image1) {
      return res.json({
        success: false,
        message: "Image is required",
      });
    }

    let { secure_url } = await cloudinary.uploader.upload(image1.path, {
      resource_type: "image",
    });

    const categoryData = {
      categoryName,
      image: secure_url,
      fileName: image1.originalname,
    };

    const category = new categoryModel(categoryData);
    await category.save();

    res.send({
      success: true,
      message: "category Added",
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

const fetchCategory = async (req, res) => {
  try {
    const category = await categoryModel.find();
    if (!category) {
      return res.json({
        success: false,
        message: "No banner found",
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.json({
        success: false,
        message: "Category id is required",
      });
    }
    const category = await categoryModel.findByIdAndDelete(id);

    if (!category) {
      return res.json({ success: false, message: "Categgory not found" });
    }

    res.json({
      success: true,
      message: "Category deleted",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export  { addCategory, fetchCategory, deleteCategory };