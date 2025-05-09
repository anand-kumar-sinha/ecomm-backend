import addressModel from "../models/addressModel.js";
import userModel from "../models/userModel.js";

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

const fetchAddreses = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const user = await userModel
      .findById(userId)
      .select("address")
      .populate("address");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address fetched successfully",
      address: user.address,
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
    if (
      user.defaultAddress &&
      user?.defaultAddress?.toString() == addressId.toString()
    ) {
      user.defaultAddress = null;
    }

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

const defaultAddress = async (req, res) => {
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

    const address = await addressModel.findById(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    address.default = true;
    await address.save();

    const user = await userModel.findById(userId).select("defaultAddress");

    if (user.defaultAddress) {
      const defaultAddress = await addressModel.findById(
        user.defaultAddress._id
      );
      defaultAddress.default = false;
      await defaultAddress.save();
    }

    user.defaultAddress = address._id;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address set as default successfully",
      address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

export {
  addAddress,
  updateAdderss,
  deleteAddress,
  fetchAddreses,
  defaultAddress,
};
