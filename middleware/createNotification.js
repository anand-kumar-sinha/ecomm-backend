import notificationModel from "../models/notificationModel.js";

const createNotification = async ({ title, body, user, type }) => {
  try {
    if (!title || !body || !user || !type) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }
    const notification = await notificationModel.create({
      title,
      body,
      user: user._id,
      type,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    user.notifications.unshift(notification._id);

    await user.save();
    return notification;
  } catch (error) {
    return error;
  }
};

export { createNotification };
