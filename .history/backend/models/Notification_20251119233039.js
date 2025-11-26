import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  body: String,
  read: { type: Boolean, default: false },
  data: Object,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);
