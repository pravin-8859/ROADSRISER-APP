import Request from "../models/Request.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// Create new roadside request
export const createRequest = async (req, res) => {
  try {
    const { location, address, serviceType } = req.body;
    const userId = req.me.id; // from protect middleware
    const reqDoc = await Request.create({
      user: userId,
      location,
      address,
      serviceType,
      status: "pending"
    });

    // create notification for user
    await Notification.create({
      user: userId,
      title: "Request created",
      body: `Your request for ${serviceType} has been created.`,
      data: { requestId: reqDoc._id }
    });

    // emit via socket if you keep server-side socket (see server.js)
    if (req.io) req.io.emit("new_request", { request: reqDoc });

    res.json({ success: true, request: reqDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create request" });
  }
};

// Get active request for user
export const getActiveRequest = async (req, res) => {
  try {
    const userId = req.me.id;
    const active = await Request.findOne({ user: userId, status: { $in: ["pending","accepted","enroute"] } }).populate("mechanic", "-password");
    res.json({ active });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch active request" });
  }
};

// Get history
export const getHistory = async (req, res) => {
  try {
    const userId = req.me.id;
    const history = await Request.find({ user: userId, status: "completed" }).sort({ createdAt: -1 }).limit(50);
    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};
