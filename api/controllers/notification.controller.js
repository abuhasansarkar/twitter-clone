import Notification from "../models/notification.model.js";

// Get all Notification
export const getNotificaions = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ to: userId })
      .sort({ createdAt: -1 })
      .populate({ path: "from", select: "username profileImg" });

    if (!notifications) return res.status(200).json([]);

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
  }
};

// All Notification Delete

export const deleteNotificaions = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: "Notificaion deleted Successfully !" });
  } catch (error) {
    res.status(500).json({ error: " Internal Server Error " });
    console.log(error);
  }
};

// Only One Notification Delete

export const deleteSingleNotificaions = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    console.log(notificationId, userId);

    const notification = await Notification.findById(notificationId);
    if (!notification)
      return res.status(404).json({ message: "Notification not Found !" });

    if (notification.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delte this Notification" });
    }

    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification Successfully Deleted !" });
  } catch (error) {
    console.log(error);
  }
};
