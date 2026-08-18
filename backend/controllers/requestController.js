import Request from "../models/Request.js";
import Notification from "../models/Notification.js";

// ======================================================
// USER - CREATE REQUEST
// ======================================================

export const createRequest = async (req, res) => {
  try {
    const {
      location,
      address,
      serviceType,
      vehicleType,
      problem,
      description,
    } = req.body;

    // User comes from protect middleware
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        message: "User authentication required",
      });
    }

    if (!location || !location.coordinates) {
      return res.status(400).json({
        message: "Location is required",
      });
    }

    const reqDoc = await Request.create({
      user: userId,
      location,
      address,
      serviceType,
      vehicleType,
      problem,
      description,
      status: "pending",
    });

    // User notification
    try {
      await Notification.create({
        user: userId,
        title: "Request created",
        body: `Your request for ${
          problem || serviceType || "roadside assistance"
        } has been created.`,
        data: {
          requestId: reqDoc._id,
        },
      });
    } catch (notificationError) {
      console.error(
        "Notification error:",
        notificationError.message
      );
    }

    return res.status(201).json({
      success: true,
      message: "Roadside request created successfully",
      request: reqDoc,
    });
  } catch (err) {
    console.error("createRequest error:", err);

    return res.status(500).json({
      message: "Could not create request",
    });
  }
};

// ======================================================
// USER - ACTIVE REQUEST
// ======================================================

export const getActiveRequest = async (req, res) => {
  try {
    const userId = req.user.id;

    const active = await Request.findOne({
      user: userId,
      status: {
        $in: ["pending", "accepted", "enroute"],
      },
    })
      .populate("mechanic", "-password -refreshToken")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      active,
    });
  } catch (err) {
    console.error("getActiveRequest error:", err);

    return res.status(500).json({
      message: "Failed to fetch active request",
    });
  }
};

// ======================================================
// USER - HISTORY
// ======================================================

export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await Request.find({
      user: userId,
      status: "completed",
    })
      .populate("mechanic", "-password -refreshToken")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({
      success: true,
      history,
    });
  } catch (err) {
    console.error("getHistory error:", err);

    return res.status(500).json({
      message: "Failed to fetch history",
    });
  }
};

// ======================================================
// MECHANIC - GET REQUESTS
// ======================================================

export const getMechanicRequests = async (req, res) => {
  try {
    const mechanicId = req.mechanic.id;

    const requests = await Request.find({
      $or: [
        // New requests available to every mechanic
        {
          status: "pending",
          mechanic: null,
        },

        // Requests already assigned to this mechanic
        {
          mechanic: mechanicId,
          status: {
            $in: ["accepted", "enroute"],
          },
        },
      ],
    })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      requests,
    });
  } catch (err) {
    console.error("getMechanicRequests error:", err);

    return res.status(500).json({
      message: "Failed to fetch mechanic requests",
    });
  }
};

// ======================================================
// MECHANIC - ACCEPT REQUEST
// ======================================================

export const acceptRequest = async (req, res) => {
  try {
    const mechanicId = req.mechanic.id;

    const request = await Request.findOne({
      _id: req.params.id,
      status: "pending",
      mechanic: null,
    });

    if (!request) {
      return res.status(404).json({
        message:
          "Request is no longer available or already accepted",
      });
    }

    request.mechanic = mechanicId;
    request.status = "accepted";

    await request.save();

    // Notify user
    try {
      await Notification.create({
        user: request.user,
        title: "Mechanic accepted your request",
        body: "A mechanic has accepted your roadside assistance request.",
        data: {
          requestId: request._id,
        },
      });
    } catch (notificationError) {
      console.error(
        "Notification error:",
        notificationError.message
      );
    }

    const populated = await Request.findById(request._id)
      .populate("user", "name email phone")
      .populate("mechanic", "name email phone garageName");

    return res.json({
      success: true,
      message: "Request accepted successfully",
      request: populated,
    });
  } catch (err) {
    console.error("acceptRequest error:", err);

    return res.status(500).json({
      message: "Failed to accept request",
    });
  }
};

// ======================================================
// MECHANIC - UPDATE STATUS
// ======================================================

export const updateRequestStatus = async (req, res) => {
  try {
    const mechanicId = req.mechanic.id;
    const { status } = req.body;

    const allowedStatuses = [
      "enroute",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid request status",
      });
    }

    const request = await Request.findOne({
      _id: req.params.id,
      mechanic: mechanicId,
      status: {
        $in: ["accepted", "enroute"],
      },
    });

    if (!request) {
      return res.status(404).json({
        message: "Assigned request not found",
      });
    }

    request.status = status;

    await request.save();

    // Notify user
    try {
      const message =
        status === "enroute"
          ? "Your mechanic is on the way."
          : "Your roadside assistance request has been completed.";

      await Notification.create({
        user: request.user,
        title:
          status === "enroute"
            ? "Mechanic is on the way"
            : "Request completed",
        body: message,
        data: {
          requestId: request._id,
        },
      });
    } catch (notificationError) {
      console.error(
        "Notification error:",
        notificationError.message
      );
    }

    const populated = await Request.findById(request._id)
      .populate("user", "name email phone")
      .populate("mechanic", "name email phone garageName");

    return res.json({
      success: true,
      message: `Request marked as ${status}`,
      request: populated,
    });
  } catch (err) {
    console.error("updateRequestStatus error:", err);

    return res.status(500).json({
      message: "Failed to update request status",
    });
  }
};