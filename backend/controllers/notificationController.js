import Notification from "../models/Notification.js";

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.me.id;
    const notes = await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(50);
    res.json({ notes });
  } catch (e) {
    res.status(500).json({ message: "Failed to load notifications" });
  }
};

export const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: "Failed to mark read" });
  }
};
