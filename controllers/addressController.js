import addressModel from "../models/addressModel";
import userModel from "../models/userModel";

const addAddress = async (req, res) => {
  try {
    const { userId, name, email, mobileNumber, address, city, state, pinCode } =
      req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }
    if (
      !name ||
      !email ||
      !mobileNumber ||
      !address ||
      !city ||
      !state ||
      !pinCode
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const newAddress = new addressModel({
      userId,
      name,
      email,
      mobileNumber,
      address,
      city,
      state,
      pinCode,
    });
    if (!newAddress) {
      return res.status(400).json({
        success: false,
        message: "Address not added",
      });
    }
    await newAddress.save();

    const user = await userModel.findById(userId);
    user.address.unshift(newAddress._id);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

const updateAdderss = async (req, res) => {
  try {
    const { userId } = req.body;
    const data = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const address = await addressModel.findByIdAndUpdate(
      data._id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "addressId is required",
      });
    }

    const address = await addressModel.findByIdAndDelete(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const user = await userModel.findById(userId);
    user.address.pull(addressId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

export { addAddress, updateAdderss, deleteAddress };
