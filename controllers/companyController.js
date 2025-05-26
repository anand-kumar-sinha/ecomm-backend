import companyModel from "../models/companyModel.js";

const updateCompany = async (req, res) => {
  try {
    const {
      name,
      about,
      mobile,
      email,
      address,
      referral,
      facebook,
      whatsapp,
      twitter,
      youtube,
      instagram,
      telegram,
    } = req.body;

    // Validate required fields
    if (!name || !about || !mobile || !email || !address) {
      return res.status(400).json({
        success: false,
        message: "Name, about, mobile, email, and address are required fields",
      });
    }

    // Check if any company exists
    const existingCompany = await companyModel.findOne();

    if (existingCompany) {
      // Update existing company
      const updatedCompany = await companyModel.findByIdAndUpdate(
        existingCompany._id,
        {
          name,
          about,
          mobile,
          email,
          address,
          referral,
          facebook,
          whatsapp,
          twitter,
          youtube,
          instagram,
          telegram,
          updatedAt: Date.now(),
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: "Company updated successfully",
        company: updatedCompany,
      });
    } else {
      // Create new company if none exists
      const newCompany = await companyModel.create({
        name,
        about,
        mobile,
        email,
        address,
        referral,
        facebook,
        whatsapp,
        twitter,
        youtube,
        instagram,
        telegram,
      });

      return res.status(201).json({
        success: true,
        message: "Company created successfully",
        company: newCompany,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const fetchCompany = async (req, res) => {
  try {
    const company = await companyModel.findOne();
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }
    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { updateCompany, fetchCompany };
