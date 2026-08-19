import Request from "../models/Request.js";
import Notification from "../models/Notification.js";
import Mechanic from "../models/Mechanic.js";

// =========================================================
// CONFIG
// =========================================================

// Nearby mechanic search radius.
// 10 km = 10000 meters.
const MAX_MECHANIC_DISTANCE = 10000;

// Live location ko kitna fresh maana jayega.
// 2 minutes se purani location ko live nahi maana jayega.
const LIVE_LOCATION_MAX_AGE = 2 * 60 * 1000;


// =========================================================
// HELPER
// =========================================================

const isValidPoint = (location) => {
  return (
    location &&
    location.type === "Point" &&
    Array.isArray(location.coordinates) &&
    location.coordinates.length === 2 &&
    Number.isFinite(
      Number(location.coordinates[0])
    ) &&
    Number.isFinite(
      Number(location.coordinates[1])
    )
  );
};


// =========================================================
// USER - CREATE REQUEST
// =========================================================

export const createRequest = async (
  req,
  res
) => {
  try {
    const {
      location,
      address,
      serviceType,
      vehicleType,
      problem,
      description,
    } = req.body;

    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        message:
          "User authentication required",
      });
    }

    // -----------------------------------------------------
    // Validate user location
    // -----------------------------------------------------

    if (!isValidPoint(location)) {
      return res.status(400).json({
        message:
          "Valid user location is required",
      });
    }

    const [lng, lat] =
      location.coordinates;

    if (
      lng < -180 ||
      lng > 180 ||
      lat < -90 ||
      lat > 90
    ) {
      return res.status(400).json({
        message:
          "Invalid location coordinates",
      });
    }

    // -----------------------------------------------------
    // Prevent duplicate active requests
    // -----------------------------------------------------

    const existingRequest =
      await Request.findOne({
        user: userId,
        status: {
          $in: [
            "pending",
            "accepted",
            "enroute",
          ],
        },
      });

    if (existingRequest) {
      return res.status(400).json({
        message:
          "You already have an active roadside request",
        request: existingRequest,
      });
    }

    // -----------------------------------------------------
    // Find nearest ONLINE mechanic
    // -----------------------------------------------------

    const liveLocationLimit =
      new Date(
        Date.now() -
          LIVE_LOCATION_MAX_AGE
      );

    let nearestMechanic = null;

    // First priority:
    // Mechanic's fresh LIVE location
    try {
      nearestMechanic =
        await Mechanic.findOne({
          isOnline: true,

          currentLocation: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [
                  Number(lng),
                  Number(lat),
                ],
              },
              $maxDistance:
                MAX_MECHANIC_DISTANCE,
            },
          },

          lastLocationUpdate: {
            $gte: liveLocationLimit,
          },
        }).select(
          "name email phone garageName currentLocation garageLocation isOnline lastLocationUpdate"
        );
    } catch (geoError) {
      console.error(
        "Live mechanic geo search error:",
        geoError.message
      );
    }

    // -----------------------------------------------------
    // Fallback:
    // Garage/shop location
    //
    // This helps when mechanic is online but
    // live GPS is temporarily unavailable.
    // -----------------------------------------------------

    if (!nearestMechanic) {
      try {
        nearestMechanic =
          await Mechanic.findOne({
            isOnline: true,

            garageLocation: {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: [
                    Number(lng),
                    Number(lat),
                  ],
                },
                $maxDistance:
                  MAX_MECHANIC_DISTANCE,
              },
            },
          }).select(
            "name email phone garageName currentLocation garageLocation isOnline lastLocationUpdate"
          );
      } catch (geoError) {
        console.error(
          "Garage geo search error:",
          geoError.message
        );
      }
    }

    // -----------------------------------------------------
    // Create request
    //
    // IMPORTANT:
    // Request is assigned to ONLY ONE nearest mechanic.
    // -----------------------------------------------------

    const reqDoc =
      await Request.create({
        user: userId,

        location: {
          type: "Point",
          coordinates: [
            Number(lng),
            Number(lat),
          ],
        },

        address,
        serviceType,
        vehicleType,
        problem,
        description,

        mechanic:
          nearestMechanic?._id ||
          null,

        status: "pending",
      });

    // -----------------------------------------------------
    // User notification
    // -----------------------------------------------------

    try {
      await Notification.create({
        user: userId,

        title:
          nearestMechanic
            ? "Mechanic found"
            : "Request created",

        body:
          nearestMechanic
            ? `${nearestMechanic.name || "A nearby mechanic"} has been selected for your request.`
            : "Your roadside assistance request has been created. We are looking for a nearby mechanic.",

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

    // -----------------------------------------------------
    // Mechanic notification
    // -----------------------------------------------------

    if (nearestMechanic) {
      try {
        // IMPORTANT:
        // Notification model currently appears
        // to be user-based, so we do not assume
        // mechanic notification schema here.
        console.log(
          `Nearest mechanic selected: ${nearestMechanic._id}`
        );
      } catch (error) {
        console.error(
          "Mechanic notification error:",
          error.message
        );
      }
    }

    // -----------------------------------------------------
    // Return populated request
    // -----------------------------------------------------

    const populated =
      await Request.findById(
        reqDoc._id
      )
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "mechanic",
          "name email phone garageName garageLocation currentLocation"
        );

    return res.status(201).json({
      success: true,

      message:
        nearestMechanic
          ? "Nearby mechanic selected and request created successfully"
          : "Request created. No nearby mechanic is currently available.",

      request: populated,

      mechanicFound:
        Boolean(nearestMechanic),
    });
  } catch (err) {
    console.error(
      "createRequest error:",
      err
    );

    return res.status(500).json({
      message:
        "Could not create request",
    });
  }
};


// =========================================================
// USER - ACTIVE REQUEST
// =========================================================

export const getActiveRequest =
  async (req, res) => {
    try {
      const userId =
        req.user.id;

      const active =
        await Request.findOne({
          user: userId,

          status: {
            $in: [
              "pending",
              "accepted",
              "enroute",
            ],
          },
        })
          .populate(
            "mechanic",
            "-password -refreshToken -otpHash -otpExpire"
          )
          .sort({
            createdAt: -1,
          });

      return res.json({
        success: true,
        active,
      });
    } catch (err) {
      console.error(
        "getActiveRequest error:",
        err
      );

      return res.status(500).json({
        message:
          "Failed to fetch active request",
      });
    }
  };


// =========================================================
// USER - HISTORY
// =========================================================

export const getHistory =
  async (req, res) => {
    try {
      const userId =
        req.user.id;

      const history =
        await Request.find({
          user: userId,
          status: "completed",
        })
          .populate(
            "mechanic",
            "-password -refreshToken -otpHash -otpExpire"
          )
          .sort({
            createdAt: -1,
          })
          .limit(50);

      return res.json({
        success: true,
        history,
      });
    } catch (err) {
      console.error(
        "getHistory error:",
        err
      );

      return res.status(500).json({
        message:
          "Failed to fetch history",
      });
    }
  };


// =========================================================
// MECHANIC - GET REQUESTS
// =========================================================

export const getMechanicRequests =
  async (req, res) => {
    try {
      const mechanicId =
        req.mechanic.id;

      const requests =
        await Request.find({
          $or: [
            // ------------------------------------------------
            // Requests specifically assigned to this mechanic
            // ------------------------------------------------
            {
              mechanic: mechanicId,

              status: {
                $in: [
                  "pending",
                  "accepted",
                  "enroute",
                ],
              },
            },

            // ------------------------------------------------
            // Old/unassigned pending requests
            // ------------------------------------------------
            {
              status: "pending",
              mechanic: null,
            },
          ],
        })
          .populate(
            "user",
            "name email phone"
          )
          .sort({
            createdAt: -1,
          });

      return res.json({
        success: true,
        requests,
      });
    } catch (err) {
      console.error(
        "getMechanicRequests error:",
        err
      );

      return res.status(500).json({
        message:
          "Failed to fetch mechanic requests",
      });
    }
  };


// =========================================================
// MECHANIC - ACCEPT REQUEST
// =========================================================

export const acceptRequest =
  async (req, res) => {
    try {
      const mechanicId =
        req.mechanic.id;

      const request =
        await Request.findOne({
          _id: req.params.id,

          mechanic: mechanicId,

          status: "pending",
        });

      if (!request) {
        return res.status(404).json({
          message:
            "Request is no longer available or is assigned to another mechanic",
        });
      }

      request.status =
        "accepted";

      await request.save();

      // -----------------------------------------------------
      // Notify user
      // -----------------------------------------------------

      try {
        await Notification.create({
          user: request.user,

          title:
            "Mechanic accepted your request",

          body:
            "Your nearby mechanic has accepted the roadside assistance request.",

          data: {
            requestId:
              request._id,
          },
        });
      } catch (notificationError) {
        console.error(
          "Notification error:",
          notificationError.message
        );
      }

      const populated =
        await Request.findById(
          request._id
        )
          .populate(
            "user",
            "name email phone"
          )
          .populate(
            "mechanic",
            "name email phone garageName garageLocation currentLocation"
          );

      return res.json({
        success: true,

        message:
          "Request accepted successfully",

        request: populated,
      });
    } catch (err) {
      console.error(
        "acceptRequest error:",
        err
      );

      return res.status(500).json({
        message:
          "Failed to accept request",
      });
    }
  };


// =========================================================
// MECHANIC - UPDATE STATUS
// =========================================================

export const updateRequestStatus =
  async (req, res) => {
    try {
      const mechanicId =
        req.mechanic.id;

      const { status } =
        req.body;

      const allowedStatuses = [
        "enroute",
        "completed",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid request status",
        });
      }

      const request =
        await Request.findOne({
          _id: req.params.id,

          mechanic: mechanicId,

          status: {
            $in: [
              "accepted",
              "enroute",
            ],
          },
        });

      if (!request) {
        return res.status(404).json({
          message:
            "Assigned request not found",
        });
      }

      request.status =
        status;

      await request.save();

      // -----------------------------------------------------
      // User notification
      // -----------------------------------------------------

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
            requestId:
              request._id,
          },
        });
      } catch (notificationError) {
        console.error(
          "Notification error:",
          notificationError.message
        );
      }

      const populated =
        await Request.findById(
          request._id
        )
          .populate(
            "user",
            "name email phone"
          )
          .populate(
            "mechanic",
            "name email phone garageName garageLocation currentLocation"
          );

      return res.json({
        success: true,

        message:
          `Request marked as ${status}`,

        request: populated,
      });
    } catch (err) {
      console.error(
        "updateRequestStatus error:",
        err
      );

      return res.status(500).json({
        message:
          "Failed to update request",
      });
    }
  };