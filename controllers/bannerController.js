import bannerModel from "../models/bannerModel.js";
import { v2 as cloudinary } from "cloudinary";
const addBanner = async (req, res) => {
  try {
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

    const bannerData = {
      fileName: image1.originalname,
      image: secure_url,
    };

    const banner = new bannerModel(bannerData);
    await banner.save();

    res.send({
      success: true,
      message: "Banner Added",
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

const fetchBanner = async (req, res) => {
  try {
    const banner = await bannerModel.find();
    if (!banner) {
      return res.json({
        success: false,
        message: "No banner found",
      });
    }

    res.json({
      success: true,
      banner,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.json({
        success: false,
        message: "Banner id is required",
      });
    }
    const banner = await bannerModel.findByIdAndDelete(id);

    if (!banner) {
      return res.json({ success: false, message: "Banner not found" });
    }

    res.json({
      success: true,
      message: "Banner deleted",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { addBanner, fetchBanner, deleteBanner };
