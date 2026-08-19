import mongoose from "mongoose";
import Request from "../models/Request.js";
import Notification from "../models/Notification.js";
import Mechanic from "../models/Mechanic.js";

// =========================================================
// CONFIG
// =========================================================

const MAX_MECHANIC_DISTANCE = 10000; // 10 km
const LIVE_LOCATION_MAX_AGE = 2 * 60 * 1000; // 2 minutes

// =========================================================
// HELPERS
// =========================================================

const isValidPoint = (location) => {
  return (
    location &&
    location.type === "Point" &&
    Array.isArray(location.coordinates) &&
    location.coordinates.length === 2 &&
    Number.isFinite(Number(location.coordinates[0])) &&
    Number.isFinite(Number(location.coordinates[1]))
  );
};

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// =========================================================
// USER - CREATE REQUEST
// =========================================================

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

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "User authentication required",
      });
    }

    // -----------------------------------------------------
    // Validate user location
    // -----------------------------------------------------

    if (!isValidPoint(location)) {
      return res.status(400).json({
        message: "Valid user location is required",
      });
    }

    const [lng, lat] = location.coordinates;

    if (
      lng < -180 ||
      lng > 180 ||
      lat < -90 ||
      lat > 90
    ) {
      return res.status(400).json({
        message: "Invalid location coordinates",
      });
    }

    // -----------------------------------------------------
    // Prevent duplicate active requests
    // -----------------------------------------------------

    const existingRequest = await Request.findOne({
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
    // Fresh location limit
    // -----------------------------------------------------

    const liveLocationLimit = new Date(
      Date.now() - LIVE_LOCATION_MAX_AGE
    );

    let nearestMechanic = null;

    // =====================================================
    // FIRST PRIORITY
    // Fresh LIVE mechanic location
    // =====================================================

    try {
      nearestMechanic =
        await Mechanic.findOne({
          isOnline: true,

          activeRequest: null,

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
          "name email phone garageName currentLocation garageLocation isOnline lastLocationUpdate activeRequest"
        );
    } catch (geoError) {
      console.error(
        "Live mechanic geo search error:",
        geoError.message
      );
    }

    // =====================================================
    // FALLBACK
    // Garage/shop location
    // =====================================================

    if (!nearestMechanic) {
      try {
        nearestMechanic =
          await Mechanic.findOne({
            isOnline: true,

            activeRequest: null,

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
            "name email phone garageName currentLocation garageLocation isOnline lastLocationUpdate activeRequest"
          );
      } catch (geoError) {
        console.error(
          "Garage geo search error:",
          geoError.message
        );
      }
    }

    // =====================================================
    // CREATE REQUEST FIRST
    // =====================================================

    const reqDoc = await Request.create({
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

      mechanic: null,

      status: "pending",
    });

    // =====================================================
    // ATOMIC MECHANIC RESERVATION
    //
    // This is the important race-condition protection.
    //
    // Even if two users select the same mechanic,
    // only ONE request can reserve activeRequest=null.
    // =====================================================

    let assignedMechanic = null;

    if (nearestMechanic) {
      try {
        assignedMechanic =
          await Mechanic.findOneAndUpdate(
            {
              _id: nearestMechanic._id,

              isOnline: true,

              activeRequest: null,
            },
            {
              $set: {
                activeRequest: reqDoc._id,
              },
            },
            {
              new: true,
            }
          ).select(
            "name email phone garageName currentLocation garageLocation isOnline lastLocationUpdate activeRequest"
          );
      } catch (reservationError) {
        console.error(
          "Mechanic reservation error:",
          reservationError.message
        );
      }
    }

    // =====================================================
    // IF RESERVATION FAILED
    //
    // Another request may have taken this mechanic between
    // findOne() and findOneAndUpdate().
    //
    // Request remains pending instead of assigning wrong
    // mechanic.
    // =====================================================

    if (!assignedMechanic) {
      await Request.findByIdAndUpdate(
        reqDoc._id,
        {
          $set: {
            mechanic: null,
          },
        }
      );

      const pendingRequest =
        await Request.findById(
          reqDoc._id
        ).populate(
          "user",
          "name email phone"
        );

      try {
        await Notification.create({
          user: userId,

          title: "Request created",

          body:
            "Your roadside assistance request has been created. We are looking for a nearby mechanic.",

          data: {
            requestId:
              reqDoc._id,
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

        message:
          "Request created. No nearby mechanic is currently available.",

        request: pendingRequest,

        mechanicFound: false,
      });
    }

    // =====================================================
    // ASSIGN MECHANIC TO REQUEST
    // =====================================================

    const assignedRequest =
      await Request.findOneAndUpdate(
        {
          _id: reqDoc._id,

          mechanic: null,

          status: "pending",
        },
        {
          $set: {
            mechanic:
              assignedMechanic._id,
          },
        },
        {
          new: true,
        }
      );

    // -----------------------------------------------------
    // Safety rollback
    // -----------------------------------------------------

    if (!assignedRequest) {
      await Mechanic.findOneAndUpdate(
        {
          _id: assignedMechanic._id,

          activeRequest:
            reqDoc._id,
        },
        {
          $set: {
            activeRequest: null,
          },
        }
      );

      return res.status(500).json({
        message:
          "Could not assign mechanic to request",
      });
    }

    // =====================================================
    // USER NOTIFICATION
    // =====================================================

    try {
      await Notification.create({
        user: userId,

        title: "Mechanic found",

        body: `${
          assignedMechanic.name ||
          "A nearby mechanic"
        } has been selected for your request.`,

        data: {
          requestId:
            assignedRequest._id,
        },
      });
    } catch (notificationError) {
      console.error(
        "User notification error:",
        notificationError.message
      );
    }

    // =====================================================
    // MECHANIC NOTIFICATION
    // =====================================================

    console.log(
      `Mechanic ${assignedMechanic._id} assigned request ${assignedRequest._id}`
    );

    // =====================================================
    // RETURN POPULATED REQUEST
    // =====================================================

    const populated =
      await Request.findById(
        assignedRequest._id
      )
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "mechanic",
          "name email phone garageName garageLocation currentLocation isOnline"
        );

    return res.status(201).json({
      success: true,

      message:
        "Nearby mechanic selected and request created successfully",

      request: populated,

      mechanicFound: true,
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

export const getActiveRequest = async (
  req,
  res
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message:
          "User authentication required",
      });
    }

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

export const getHistory = async (
  req,
  res
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message:
          "User authentication required",
      });
    }

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
        req.mechanic?.id;

      if (!mechanicId) {
        return res.status(401).json({
          message:
            "Mechanic authentication required",
        });
      }

      const requests =
        await Request.find({
          $or: [
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

export const acceptRequest = async (
  req,
  res
) => {
  try {
    const mechanicId =
      req.mechanic?.id;

    const requestId =
      req.params.id;

    if (!mechanicId) {
      return res.status(401).json({
        message:
          "Mechanic authentication required",
      });
    }

    if (!isValidObjectId(requestId)) {
      return res.status(400).json({
        message:
          "Invalid request ID",
      });
    }

    // -----------------------------------------------------
    // Atomic accept
    // -----------------------------------------------------

    const request =
      await Request.findOneAndUpdate(
        {
          _id: requestId,

          mechanic: mechanicId,

          status: "pending",
        },
        {
          $set: {
            status: "accepted",
          },
        },
        {
          new: true,
        }
      );

    if (!request) {
      return res.status(404).json({
        message:
          "Request is no longer available or is assigned to another mechanic",
      });
    }

    // =====================================================
    // USER NOTIFICATION
    // =====================================================

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

    // =====================================================
    // POPULATE
    // =====================================================

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
          "name email phone garageName garageLocation currentLocation isOnline"
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
// MECHANIC - UPDATE REQUEST STATUS
// =========================================================

export const updateRequestStatus =
  async (req, res) => {
    try {
      const mechanicId =
        req.mechanic?.id;

      const requestId =
        req.params.id;

      const { status } =
        req.body;

      if (!mechanicId) {
        return res.status(401).json({
          message:
            "Mechanic authentication required",
        });
      }

      if (!isValidObjectId(requestId)) {
        return res.status(400).json({
          message:
            "Invalid request ID",
        });
      }

      // -----------------------------------------------------
      // Allowed status values
      // -----------------------------------------------------

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

      // =====================================================
      // ENROUTE
      // =====================================================

      if (status === "enroute") {
        const request =
          await Request.findOneAndUpdate(
            {
              _id: requestId,

              mechanic: mechanicId,

              status: "accepted",
            },
            {
              $set: {
                status: "enroute",
              },
            },
            {
              new: true,
            }
          );

        if (!request) {
          return res.status(404).json({
            message:
              "Accepted request not found or status transition is not allowed",
          });
        }

        try {
          await Notification.create({
            user: request.user,

            title:
              "Mechanic is on the way",

            body:
              "Your mechanic is on the way.",

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
              "name email phone garageName garageLocation currentLocation isOnline"
            );

        return res.json({
          success: true,

          message:
            "Request marked as enroute",

          request: populated,
        });
      }

      // =====================================================
      // COMPLETED
      // =====================================================

      if (status === "completed") {
        const request =
          await Request.findOneAndUpdate(
            {
              _id: requestId,

              mechanic: mechanicId,

              status: "enroute",
            },
            {
              $set: {
                status: "completed",
              },
            },
            {
              new: true,
            }
          );

        if (!request) {
          return res.status(404).json({
            message:
              "Enroute request not found or status transition is not allowed",
          });
        }

        // ---------------------------------------------------
        // RELEASE MECHANIC
        // ---------------------------------------------------

        await Mechanic.findOneAndUpdate(
          {
            _id: mechanicId,

            activeRequest:
              request._id,
          },
          {
            $set: {
              activeRequest: null,
            },
          }
        );

        // ===================================================
        // USER NOTIFICATION
        // ===================================================

        try {
          await Notification.create({
            user: request.user,

            title:
              "Request completed",

            body:
              "Your roadside assistance request has been completed.",

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
              "name email phone garageName garageLocation currentLocation isOnline"
            );

        return res.json({
          success: true,

          message:
            "Request marked as completed",

          request: populated,
        });
      }

      return res.status(400).json({
        message:
          "Invalid request status",
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