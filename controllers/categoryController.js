import categoryModel from "../models/categoryModel";

const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];

    const images = [image1].filter((item) => item !== undefined);
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const categoryData = {
      categoryName,
      image: imagesUrl,
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


export  { addCategory };