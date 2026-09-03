import mongoose from "mongoose";
import Request from "../models/Request.js";
import Notification from "../models/Notification.js";
import Mechanic from "../models/Mechanic.js";

// =========================================================
// CONFIG
// =========================================================

const MAX_MECHANIC_DISTANCE = 10000; // 10 KM
const LIVE_LOCATION_MAX_AGE = 2 * 60 * 1000; // 2 MINUTES

// =========================================================
// HELPERS
// =========================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const isValidPoint = (location) => {
  if (!location) return false;

  if (location.type !== "Point") return false;

  if (!Array.isArray(location.coordinates)) {
    return false;
  }

  if (location.coordinates.length !== 2) {
    return false;
  }

  const lng = Number(location.coordinates[0]);
  const lat = Number(location.coordinates[1]);

  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    return false;
  }

  if (lng < -180 || lng > 180) {
    return false;
  }

  if (lat < -90 || lat > 90) {
    return false;
  }

  return true;
};

const mechanicSelect =
  "name email phone garageName garageLocation currentLocation isOnline lastLocationUpdate activeRequest";

// =========================================================
// FIND + RESERVE NEXT MECHANIC
// =========================================================

const findAndReserveNextMechanic = async (
  request,
  excludedMechanicId
) => {
  if (!request?.location?.coordinates) {
    return null;
  }

  const coordinates = request.location.coordinates;

  if (
    !Array.isArray(coordinates) ||
    coordinates.length !== 2
  ) {
    return null;
  }

  const lng = Number(coordinates[0]);
  const lat = Number(coordinates[1]);

  if (
    !Number.isFinite(lng) ||
    !Number.isFinite(lat) ||
    lng < -180 ||
    lng > 180 ||
    lat < -90 ||
    lat > 90
  ) {
    return null;
  }

  const liveLocationLimit = new Date(
    Date.now() - LIVE_LOCATION_MAX_AGE
  );

  const baseFilter = {
    isOnline: true,
    activeRequest: null,
  };

  if (excludedMechanicId) {
    baseFilter._id = {
      $ne: excludedMechanicId,
    };
  }

  let candidate = null;

  // =======================================================
  // FIRST PRIORITY:
  // FRESH LIVE LOCATION
  // =======================================================

  try {
    candidate = await Mechanic.findOne({
      ...baseFilter,

      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },

          $maxDistance: MAX_MECHANIC_DISTANCE,
        },
      },

      lastLocationUpdate: {
        $gte: liveLocationLimit,
      },
    }).select(mechanicSelect);
  } catch (error) {
    console.error(
      "Live mechanic search error:",
      error.message
    );
  }

  // =======================================================
  // SECOND PRIORITY:
  // GARAGE LOCATION
  // =======================================================

  if (!candidate) {
    try {
      candidate = await Mechanic.findOne({
        ...baseFilter,

        garageLocation: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },

            $maxDistance: MAX_MECHANIC_DISTANCE,
          },
        },
      }).select(mechanicSelect);
    } catch (error) {
      console.error(
        "Garage mechanic search error:",
        error.message
      );
    }
  }

  if (!candidate) {
    return null;
  }

  // =======================================================
  // ATOMIC RESERVATION
  // =======================================================

  const reservedMechanic =
    await Mechanic.findOneAndUpdate(
      {
        _id: candidate._id,
        isOnline: true,
        activeRequest: null,
      },

      {
        $set: {
          activeRequest: request._id,
        },
      },

      {
        new: true,
      }
    ).select(mechanicSelect);

  return reservedMechanic || null;
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

    // =====================================================
    // VALIDATE LOCATION
    // =====================================================

    if (!isValidPoint(location)) {
      return res.status(400).json({
        message: "Valid user location is required",
      });
    }

    const lng = Number(location.coordinates[0]);
    const lat = Number(location.coordinates[1]);

    if (
      !Number.isFinite(lng) ||
      !Number.isFinite(lat) ||
      lng < -180 ||
      lng > 180 ||
      lat < -90 ||
      lat > 90
    ) {
      return res.status(400).json({
        message: "Invalid location coordinates",
      });
    }

    // =====================================================
    // PREVENT DUPLICATE ACTIVE REQUEST
    // =====================================================

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

    // =====================================================
    // CREATE UNASSIGNED REQUEST
    // =====================================================
    //
    // IMPORTANT:
    // Request kisi ek mechanic ko yahan assign nahi hogi.
    // Nearby mechanics apne dashboard par request dekhenge.
    //

    const request = await Request.create({
      user: userId,

      location: {
        type: "Point",
        coordinates: [lng, lat],
      },

      address: address || "",
      serviceType: serviceType || "",
      vehicleType: vehicleType || "",
      problem: problem || "",
      description: description || "",

      mechanic: null,

      declinedMechanics: [],

      status: "pending",
    });

    // =====================================================
    // USER NOTIFICATION
    // =====================================================

    try {
      await Notification.create({
        user: userId,

        title:
          "Roadside assistance request created",

        body:
          "Your request has been created. Nearby available mechanics can now accept it.",

        data: {
          requestId: request._id,
        },
      });
    } catch (notificationError) {
      console.error(
        "Request notification error:",
        notificationError.message
      );
    }

    // =====================================================
    // RETURN POPULATED REQUEST
    // =====================================================

    const populated =
      await Request.findById(request._id)
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "mechanic",
          "name email phone garageName garageLocation currentLocation isOnline lastLocationUpdate"
        );

    return res.status(201).json({
      success: true,

      message:
        "Request created successfully. Nearby mechanics can accept it.",

      request: populated,

      mechanicFound: false,
    });
  } catch (error) {
    console.error(
      "createRequest error:",
      error
    );

    return res.status(500).json({
      message:
        "Could not create request",
    });
  }
};

// =========================================================
// USER - GET ACTIVE REQUEST
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
  } catch (error) {
    console.error(
      "getActiveRequest error:",
      error
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
        status: {
  $in: ["completed", "cancelled"],
},
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
  } catch (error) {
    console.error(
      "getHistory error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch history",
    });
  }
};

// =========================================================
// MECHANIC - GET REQUESTS
// =========================================================

export const getMechanicRequests = async (
  req,
  res
) => {
  try {
    const mechanicId =
      req.mechanic?.id;

    if (!mechanicId) {
      return res.status(401).json({
        message:
          "Mechanic authentication required",
      });
    }

    // =====================================================
    // GET CURRENT MECHANIC
    // =====================================================

    const mechanic =
      await Mechanic.findById(
        mechanicId
      ).select(
        "isOnline activeRequest currentLocation garageLocation lastLocationUpdate"
      );

    if (!mechanic) {
      return res.status(404).json({
        message:
          "Mechanic not found",
      });
    }

    // =====================================================
    // GET ALREADY ASSIGNED JOBS
    // =====================================================

    const assignedRequests =
      await Request.find({
        mechanic: mechanicId,

        status: {
          $in: [
            "accepted",
            "enroute",
          ],
        },
      })
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "mechanic",
          "name email phone garageName garageLocation currentLocation isOnline lastLocationUpdate activeRequest"
        )
        .sort({
          createdAt: -1,
        });

    // =====================================================
    // IF MECHANIC IS OFFLINE/BUSY
    // =====================================================
    //
    // Assigned jobs still return honge,
    // lekin new requests nahi milengi.
    //

    if (
      !mechanic.isOnline ||
      mechanic.activeRequest
    ) {
      return res.json({
        success: true,
        requests: assignedRequests,
      });
    }

    // =====================================================
    // MECHANIC LOCATION
    // =====================================================

    let mechanicLocation = null;

    if (
      isValidPoint(
        mechanic.currentLocation
      )
    ) {
      mechanicLocation =
        mechanic.currentLocation;
    } else if (
      isValidPoint(
        mechanic.garageLocation
      )
    ) {
      mechanicLocation =
        mechanic.garageLocation;
    }

    if (!mechanicLocation) {
      return res.json({
        success: true,
        requests: assignedRequests,
      });
    }

    const mechanicLng =
      Number(
        mechanicLocation.coordinates[0]
      );

    const mechanicLat =
      Number(
        mechanicLocation.coordinates[1]
      );

    // =====================================================
    // GET ALL PENDING UNASSIGNED REQUESTS
    // =====================================================

    const pendingRequests =
      await Request.find({
        mechanic: null,

        status: "pending",

        declinedMechanics: {
          $ne: mechanicId,
        },
      })
        .populate(
          "user",
          "name email phone"
        )
        .sort({
          createdAt: -1,
        })
        .limit(100);

    // =====================================================
    // HAVERSINE DISTANCE
    // =====================================================

    const toRadians = (value) =>
      (value * Math.PI) / 180;

    const calculateDistanceKm = (
      lat1,
      lng1,
      lat2,
      lng2
    ) => {
      const earthRadiusKm = 6371;

      const dLat = toRadians(
        lat2 - lat1
      );

      const dLng = toRadians(
        lng2 - lng1
      );

      const a =
        Math.sin(dLat / 2) *
          Math.sin(dLat / 2) +
        Math.cos(
          toRadians(lat1)
        ) *
          Math.cos(
            toRadians(lat2)
          ) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);

      const c =
        2 *
        Math.atan2(
          Math.sqrt(a),
          Math.sqrt(1 - a)
        );

      return earthRadiusKm * c;
    };

    // =====================================================
    // FILTER REQUESTS WITHIN 10 KM
    // =====================================================

    const nearbyRequests = [];

    for (
      const request of pendingRequests
    ) {
      if (
        !isValidPoint(
          request.location
        )
      ) {
        continue;
      }

      const requestLng =
        Number(
          request.location.coordinates[0]
        );

      const requestLat =
        Number(
          request.location.coordinates[1]
        );

      const distanceKm =
        calculateDistanceKm(
          mechanicLat,
          mechanicLng,
          requestLat,
          requestLng
        );

      if (
        distanceKm <=
        MAX_MECHANIC_DISTANCE / 1000
      ) {
        const data =
          request.toObject();

        data.distanceKm =
          Number(
            distanceKm.toFixed(2)
          );

        nearbyRequests.push(data);
      }
    }

    // =====================================================
    // NEAREST REQUEST FIRST
    // =====================================================

    nearbyRequests.sort(
      (a, b) =>
        a.distanceKm -
        b.distanceKm
    );

    // =====================================================
    // FINAL RESPONSE
    // =====================================================

    return res.json({
      success: true,

      requests: [
        ...assignedRequests.map(
          (request) =>
            request.toObject()
        ),

        ...nearbyRequests,
      ],
    });
  } catch (error) {
    console.error(
      "getMechanicRequests error:",
      error
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

    if (
      !isValidObjectId(
        requestId
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid request ID",
      });
    }

    // =====================================================
    // CHECK MECHANIC AVAILABILITY
    // =====================================================

    const mechanic =
      await Mechanic.findOne({
        _id: mechanicId,

        isOnline: true,

        activeRequest: null,
      });

    if (!mechanic) {
      return res.status(409).json({
        message:
          "You are offline or already handling another request.",
      });
    }

    // =====================================================
    // RESERVE MECHANIC FIRST
    // =====================================================

    const reservedMechanic =
      await Mechanic.findOneAndUpdate(
        {
          _id: mechanicId,

          isOnline: true,

          activeRequest: null,
        },

        {
          $set: {
            activeRequest:
              requestId,
          },
        },

        {
          new: true,
        }
      );

    if (!reservedMechanic) {
      return res.status(409).json({
        message:
          "You are no longer available.",
      });
    }

    // =====================================================
    // ATOMIC FIRST-ACCEPT-WINS CLAIM
    // =====================================================

    const request =
      await Request.findOneAndUpdate(
        {
          _id: requestId,

          mechanic: null,

          status: "pending",

          declinedMechanics: {
            $ne: mechanicId,
          },
        },

        {
          $set: {
            mechanic: mechanicId,

            status: "accepted",
          },
        },

        {
          new: true,
        }
      );

    // =====================================================
    // SOMEONE ELSE ACCEPTED FIRST
    // =====================================================

    if (!request) {
      await Mechanic.findOneAndUpdate(
        {
          _id: mechanicId,

          activeRequest:
            requestId,
        },

        {
          $set: {
            activeRequest: null,
          },
        }
      );

      return res.status(409).json({
        message:
          "Request is no longer available. Another mechanic may have already accepted it.",
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
          "A nearby mechanic has accepted your roadside assistance request.",

        data: {
          requestId:
            request._id,

          mechanicId:
            mechanicId,
        },
      });
    } catch (notificationError) {
      console.error(
        "Accept notification error:",
        notificationError.message
      );
    }

    // =====================================================
    // POPULATE REQUEST
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
          "name email phone garageName garageLocation currentLocation isOnline lastLocationUpdate activeRequest"
        );

    return res.json({
      success: true,

      message:
        "Request accepted successfully",

      request: populated,
    });
  } catch (error) {
    console.error(
      "acceptRequest error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to accept request",
    });
  }
};
// =========================================================
// MECHANIC - DECLINE / CANCEL REQUEST
// =========================================================

export const cancelMechanicRequest = async (
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

    if (
      !isValidObjectId(
        requestId
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid request ID",
      });
    }

    // =====================================================
    // FIRST:
    // CHECK WHETHER THIS IS AN UNASSIGNED PENDING OFFER
    // =====================================================

    const pendingOffer =
      await Request.findOne({
        _id: requestId,

        mechanic: null,

        status: "pending",

        declinedMechanics: {
          $ne: mechanicId,
        },
      });

    if (pendingOffer) {
      // -----------------------------------------------
      // DECLINE ONLY FOR THIS MECHANIC
      // -----------------------------------------------

      await Request.findOneAndUpdate(
        {
          _id: requestId,

          mechanic: null,

          status: "pending",

          declinedMechanics: {
            $ne: mechanicId,
          },
        },

        {
          $addToSet: {
            declinedMechanics:
              mechanicId,
          },
        }
      );

      return res.json({
        success: true,

        declined: true,

        message:
          "Request declined successfully.",
      });
    }

    // =====================================================
    // SECOND:
    // ACCEPTED REQUEST CANCELLATION
    // =====================================================

    const cancellationId =
      new mongoose.Types.ObjectId();

    const cancelledAt =
      new Date();

    const request =
      await Request.findOneAndUpdate(
        {
          _id: requestId,

          mechanic: mechanicId,

          status: {
            $in: [
              "accepted",
              "pending",
            ],
          },
        },

        {
          $set: {
            mechanic: null,

            status: "pending",

            cancelledBy: null,

            cancelledAt: null,
          },

          $push: {
            cancellationHistory: {
              _id:
                cancellationId,

              mechanic:
                mechanicId,

              cancelledAt,

              reassignedTo: null,

              reassignedAt: null,
            },
          },

          $addToSet: {
            declinedMechanics:
              mechanicId,
          },
        },

        {
          new: true,
        }
      );

    if (!request) {
      return res.status(404).json({
        message:
          "Request cannot be cancelled or is no longer assigned to you.",
      });
    }

    // =====================================================
    // RELEASE MECHANIC
    // =====================================================

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

    // =====================================================
    // IMPORTANT:
    // DO NOT AUTO-ASSIGN ANOTHER MECHANIC HERE.
    //
    // Request is now pending again.
    // All other eligible nearby mechanics
    // will see it through getMechanicRequests().
    // =====================================================

    // =====================================================
    // USER NOTIFICATION
    // =====================================================

    try {
      await Notification.create({
        user: request.user,

        title:
          "Mechanic cancelled the request",

        body:
          "The previous mechanic is no longer available. The request is now available to another nearby mechanic.",

        data: {
          requestId:
            request._id,
        },
      });
    } catch (notificationError) {
      console.error(
        "Cancel notification error:",
        notificationError.message
      );
    }

    // =====================================================
    // RETURN UPDATED REQUEST
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
          "name email phone garageName garageLocation currentLocation isOnline lastLocationUpdate activeRequest"
        );

    return res.json({
      success: true,

      cancelled: true,

      message:
        "Request cancelled and made available to other nearby mechanics.",

      request: populated,
    });
  } catch (error) {
    console.error(
      "cancelMechanicRequest error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to cancel request",
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
          message: "Invalid request ID",
        });
      }

      if (
        !["enroute", "completed"].includes(
          status
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid request status",
        });
      }

      // ===================================================
      // ENROUTE
      // ===================================================

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
        } catch (error) {
          console.error(
            "Enroute notification error:",
            error.message
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
              "name email phone garageName garageLocation currentLocation isOnline lastLocationUpdate"
            );

        return res.json({
          success: true,

          message:
            "Request marked as enroute",

          request: populated,
        });
      }

      // ===================================================
      // COMPLETED
      // ===================================================

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

        // -------------------------------------------------
        // RELEASE MECHANIC
        // -------------------------------------------------

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

        // -------------------------------------------------
        // USER NOTIFICATION
        // -------------------------------------------------

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
        } catch (error) {
          console.error(
            "Completed notification error:",
            error.message
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
              "name email phone garageName garageLocation currentLocation isOnline lastLocationUpdate"
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
    } catch (error) {
      console.error(
        "updateRequestStatus error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to update request",
      });
    }
  };

  // =========================================================
// USER - CANCEL REQUEST
// =========================================================

export const cancelUserRequest = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?.id;

    const requestId =
      req.params.id;

    if (!userId) {
      return res.status(401).json({
        message:
          "User authentication required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        requestId
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid request ID",
      });
    }

    /*
     * Pehle currently assigned mechanic ko read karo.
     * Agar mechanic assigned hai to cancellation ke baad
     * uska activeRequest release karna hoga.
     */

    const existingRequest =
      await Request.findOne({
        _id: requestId,

        user: userId,

        status: "pending",
      }).select(
        "mechanic"
      );

    if (!existingRequest) {
      const currentRequest =
        await Request.findOne({
          _id: requestId,

          user: userId,
        }).select(
          "status"
        );

      if (!currentRequest) {
        return res.status(404).json({
          message:
            "Request not found",
        });
      }

      if (
        currentRequest.status ===
        "cancelled"
      ) {
        return res.status(409).json({
          message:
            "Request is already cancelled",
        });
      }

      return res.status(409).json({
        message:
          "Request can only be cancelled while it is pending",
      });
    }

    const previousMechanicId =
      existingRequest.mechanic ||
      null;

    /*
     * =====================================================
     * ATOMIC USER CANCELLATION
     * =====================================================
     *
     * Agar mechanic isi moment accept kar deta hai,
     * to ye update fail ho jayega.
     *
     * Isse user ko galat "cancelled" response nahi milega.
     */

    const request =
      await Request.findOneAndUpdate(
        {
          _id: requestId,

          user: userId,

          status: "pending",
        },

        {
          $set: {
            status: "cancelled",

            mechanic: null,

            cancelledBy: "user",

            cancelledAt: new Date(),
          },
        },

        {
          new: true,
        }
      );

    if (!request) {
      return res.status(409).json({
        message:
          "Request could not be cancelled because its status changed. Please refresh and try again.",
      });
    }

    /*
     * =====================================================
     * RELEASE ASSIGNED MECHANIC
     * =====================================================
     */

    if (previousMechanicId) {
      await Mechanic.findOneAndUpdate(
        {
          _id:
            previousMechanicId,

          activeRequest:
            request._id,
        },

        {
          $set: {
            activeRequest:
              null,
          },
        }
      );
    }

    /*
     * =====================================================
     * USER NOTIFICATION
     * =====================================================
     */

    try {
      await Notification.create({
        user: userId,

        title:
          "Request cancelled",

        body:
          "Your roadside assistance request has been cancelled successfully.",

        data: {
          requestId:
            request._id,
        },
      });
    } catch (notificationError) {
      console.error(
        "User cancellation notification error:",
        notificationError.message
      );
    }

    /*
     * =====================================================
     * RETURN
     * =====================================================
     */

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
          "name email phone garageName garageLocation currentLocation isOnline lastLocationUpdate"
        );

    return res.json({
      success: true,

      message:
        "Request cancelled successfully",

      request: populated,
    });
  } catch (error) {
    console.error(
      "cancelUserRequest error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to cancel request",
    });
  }
};