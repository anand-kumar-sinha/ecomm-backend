import notificationModel from "../models/notificationModel.js";
import userModel from "../models/userModel.js";

const fetchAllNotifications = async (req, res) => {
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
      .select("notifications")
      .populate("notifications");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      notifications: user.notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeSingleNotification = async (req, res) => {
  try {
    const { userId, notificationId } = req.body;

    if (!userId || !notificationId) {
      return res.status(400).json({
        success: false,
        message: `${!userId ? "userId" : "notificationId"} is required`,
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.notifications.includes(notificationId)) {
      return res.status(404).json({
        success: false,
        message: "Notification not found in user's notifications",
      });
    }

    // Remove the notification from user's list
    user.notifications.pull(notificationId);
    await user.save();

    // Then delete the notification from the notification collection
    const deleted = await notificationModel.findByIdAndDelete(notificationId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification removed successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAllNotifications = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const user = await userModel.findById(userId).select("notifications");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await notificationModel.deleteMany({ _id: { $in: user.notifications } });

    user.notifications = [];
    await user.save();

    return res.status(200).json({
      success: true,
      message: "All notifications deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export { fetchAllNotifications, removeSingleNotification, deleteAllNotifications };
