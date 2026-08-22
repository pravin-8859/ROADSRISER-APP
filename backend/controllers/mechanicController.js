import Mechanic from "../models/Mechanic.js";

import {
  generateOtp,
  hashOtp,
  verifyOtpHash,
} from "../utils/otp.js";

import { sendEmail } from "../utils/email.js";

import {
  createAccessToken,
  createRefreshToken,
} from "../utils/token.js";

import jwt from "jsonwebtoken";

// =========================================================
// HELPERS
// =========================================================

const normalizePhone = (raw) =>
  raw
    ? String(raw)
        .replace(/\D/g, "")
        .slice(-10)
    : "";

const cleanEmail = (raw) =>
  raw
    ? String(raw).toLowerCase().trim()
    : "";

const isValidCoordinates = (coordinates) => {
  if (
    !Array.isArray(coordinates) ||
    coordinates.length !== 2
  ) {
    return false;
  }

  const [lng, lat] = coordinates;

  return (
    Number.isFinite(Number(lng)) &&
    Number.isFinite(Number(lat)) &&
    Number(lng) >= -180 &&
    Number(lng) <= 180 &&
    Number(lat) >= -90 &&
    Number(lat) <= 90
  );
};

const buildPoint = (coordinates) => {
  if (!isValidCoordinates(coordinates)) {
    return null;
  }

  return {
    type: "Point",
    coordinates: [
      Number(coordinates[0]),
      Number(coordinates[1]),
    ],
  };
};

// =========================================================
// SEND OTP
// =========================================================

export const sendOtp = async (req, res) => {
  try {
    const {
      email,
      phone: rawPhone,
    } = req.body;

    const otp = generateOtp(4);

    const otpHash = await hashOtp(otp);

    const otpExpire = new Date(
      Date.now() + 5 * 60 * 1000
    );

    let mech = null;

    // ================= EMAIL OTP =================

    if (
      email &&
      typeof email === "string"
    ) {
      const emailAddress =
        cleanEmail(email);

      mech = await Mechanic.findOne({
        email: emailAddress,
      });

      if (!mech) {
        mech = new Mechanic({
          email: emailAddress,
        });
      }

      mech.otpHash = otpHash;
      mech.otpExpire = otpExpire;
      mech.isVerified = false;

      await mech.save({
        validateBeforeSave: false,
      });

      await sendEmail({
        to: emailAddress,
        subject: "Your RoadsRiser OTP",
        html: `
          <h3>RoadsRiser OTP</h3>
          <p>Your OTP is <b>${otp}</b></p>
          <p>Valid for 5 minutes.</p>
        `,
      });

      console.log(
        "MECHANIC EMAIL OTP:",
        otp
      );

      return res.json({
        success: true,
        message: "OTP sent to email",

        ...(process.env.DEBUG_SEND_OTP ===
          "true" && {
          debugOtp: otp,
        }),
      });
    }

    // ================= PHONE OTP =================

    const phone =
      normalizePhone(rawPhone);

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        message:
          "Valid email or phone required",
      });
    }

    mech = await Mechanic.findOne({
      phone,
    });

    if (!mech) {
      mech = new Mechanic({
        phone,
      });
    }

    mech.otpHash = otpHash;
    mech.otpExpire = otpExpire;
    mech.isVerified = false;

    await mech.save({
      validateBeforeSave: false,
    });

    console.log(
      "MECHANIC PHONE OTP:",
      otp
    );

    return res.json({
      success: true,
      message: "OTP sent to phone",

      ...(process.env.DEBUG_SEND_OTP ===
        "true" && {
        debugOtp: otp,
      }),
    });
  } catch (err) {
    console.error(
      "sendOtp error:",
      err
    );

    return res.status(500).json({
      message: "Failed to send OTP",
    });
  }
};

// =========================================================
// MECHANIC SIGNUP
// =========================================================

export const mechanicSignup = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
      phone: rawPhone,
      gst,
      garageName,
      address,
      otp,
      garageLocation,
    } = req.body;

    if (!otp) {
      return res.status(400).json({
        message: "OTP required",
      });
    }

    const phone =
      normalizePhone(rawPhone);

    const emailAddress =
      cleanEmail(email);

    let mech = null;

    if (emailAddress) {
      mech = await Mechanic.findOne({
        email: emailAddress,
      });
    }

    if (!mech && phone) {
      mech = await Mechanic.findOne({
        phone,
      });
    }

    if (!mech || !mech.otpHash) {
      return res.status(400).json({
        message: "OTP not requested",
      });
    }

    if (
      !mech.otpExpire ||
      new Date() > mech.otpExpire
    ) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    const validOtp =
      await verifyOtpHash(
        otp,
        mech.otpHash
      );

    if (!validOtp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // ================= PHONE =================

    if (phone) {
      const existingPhone =
        await Mechanic.findOne({
          phone,
          _id: {
            $ne: mech._id,
          },
        });

      if (existingPhone) {
        return res.status(400).json({
          message:
            "Phone already registered",
        });
      }

      mech.phone = phone;
    }

    // ================= BASIC DATA =================

    mech.name =
      name?.trim() || "";

    mech.email =
      emailAddress;

    mech.password =
      password;

    mech.gst =
      gst?.trim() || "";

    mech.garageName =
      garageName?.trim() || "";

    mech.address =
      address?.trim() || "";

    // ================= GARAGE LOCATION =================

    if (
      garageLocation?.coordinates &&
      isValidCoordinates(
        garageLocation.coordinates
      )
    ) {
      mech.garageLocation =
        buildPoint(
          garageLocation.coordinates
        );
    }

    mech.isVerified = true;

    mech.otpHash = undefined;
    mech.otpExpire = undefined;

    await mech.save();

    return res.status(201).json({
      success: true,
      message:
        "Mechanic registered successfully",

      mechanic: {
        id: mech._id,
        name: mech.name,
        email: mech.email,
        phone: mech.phone || "",
        garageName:
          mech.garageName || "",
        gst: mech.gst || "",
        address:
          mech.address || "",
        garageLocation:
          mech.garageLocation || null,
        isVerified:
          mech.isVerified,
      },
    });
  } catch (err) {
    console.error(
      "mechanicSignup error:",
      err
    );

    if (err.code === 11000) {
      return res.status(400).json({
        message:
          "Email or phone already registered",
      });
    }

    return res.status(500).json({
      message: "Signup failed",
    });
  }
};

// =========================================================
// MECHANIC LOGIN
// =========================================================

export const mechanicLogin = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    const cleanEmail =
      email.toLowerCase().trim();

    const mech =
      await Mechanic.findOne({
        email: cleanEmail,
      });

    if (!mech) {
      return res.status(404).json({
        message:
          "Mechanic not found",
      });
    }

    const match =
      await mech.matchPassword(
        password
      );

    if (!match) {
      return res.status(400).json({
        message:
          "Invalid credentials",
      });
    }

    if (!mech.isVerified) {
      return res.status(403).json({
        message:
          "Mechanic account is not verified",
      });
    }

    // ================= ACCESS TOKEN =================

    const accessToken =
      createAccessToken(
        mech._id
      );

    // ================= REFRESH TOKEN =================

    const refreshToken =
      createRefreshToken(
        mech._id
      );

    mech.refreshToken =
      refreshToken;

    await mech.save();

    // ================= COOKIE =================

    res.cookie(
      "rr_refresh",
      refreshToken,
      {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge:
          7 * 24 * 60 * 60 * 1000,
      }
    );

    return res.json({
      success: true,
      message:
        "Login successful",

      accessToken,

      mechanic: {
        id: mech._id,
        name: mech.name || "",
        email: mech.email || "",
        phone: mech.phone || "",
        garageName:
          mech.garageName || "",
        gst: mech.gst || "",
        address:
          mech.address || "",
        profilePhoto:
          mech.profilePhoto || "",
        isVerified:
          mech.isVerified,
      },
    });
  } catch (err) {
    console.error(
      "mechanicLogin error:",
      err
    );

    return res.status(500).json({
      message: "Login failed",
    });
  }
};

// =========================================================
// REFRESH MECHANIC ACCESS TOKEN
// =========================================================

export const refreshMechanicToken =
  async (req, res) => {
    try {
      const token =
        req.cookies?.rr_refresh;

      if (!token) {
        return res.status(401).json({
          message:
            "Refresh token missing",
        });
      }

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_REFRESH_SECRET
        );

      if (
        !decoded.id ||
        decoded.type !== "mechanic"
      ) {
        return res.status(401).json({
          message:
            "Invalid refresh token",
        });
      }

      const mechanic =
        await Mechanic.findOne({
          _id: decoded.id,
          refreshToken: token,
        });

      if (!mechanic) {
        return res.status(401).json({
          message:
            "Refresh token is no longer valid",
        });
      }

      const accessToken =
        createAccessToken(
          mechanic._id
        );

      return res.json({
        success: true,
        accessToken,
      });
    } catch (err) {
      console.error(
        "refreshMechanicToken error:",
        err.message
      );

      return res.status(401).json({
        message:
          "Invalid or expired refresh token",
      });
    }
  };

// =========================================================
// GET MECHANIC PROFILE
// =========================================================

export const getMechanicProfile =
  async (req, res) => {
    try {
      const mechanicId =
        req.mechanic.id;

      const mechanic =
        await Mechanic.findById(
          mechanicId
        ).select(
          "-password -refreshToken -otpHash -otpExpire"
        );

      if (!mechanic) {
        return res.status(404).json({
          message:
            "Mechanic not found",
        });
      }

      return res.json({
        success: true,
        mechanic,
      });
    } catch (err) {
      console.error(
        "getMechanicProfile error:",
        err
      );

      return res.status(500).json({
        message:
          "Failed to load mechanic profile",
      });
    }
  };

// =========================================================
// UPDATE GARAGE LOCATION
// =========================================================

export const updateGarageLocation =
  async (req, res) => {
    try {
      const mechanicId =
        req.mechanic.id;

      const {
        coordinates,
      } = req.body;

      if (
        !isValidCoordinates(
          coordinates
        )
      ) {
        return res.status(400).json({
          message:
            "Valid coordinates required as [longitude, latitude]",
        });
      }

      const garageLocation =
        buildPoint(coordinates);

      const mech =
        await Mechanic.findByIdAndUpdate(
          mechanicId,
          {
            $set: {
              garageLocation,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        ).select(
          "-password -refreshToken -otpHash -otpExpire"
        );

      if (!mech) {
        return res.status(404).json({
          message:
            "Mechanic not found",
        });
      }

      return res.json({
        success: true,
        message:
          "Garage location saved successfully",
        garageLocation:
          mech.garageLocation,
      });
    } catch (err) {
      console.error(
        "updateGarageLocation error:",
        err
      );

      return res.status(500).json({
        message:
          "Failed to save garage location",
      });
    }
  };

// =========================================================
// UPDATE CURRENT / LIVE LOCATION
// =========================================================

export const updateCurrentLocation =
  async (req, res) => {
    try {
      const mechanicId =
        req.mechanic.id;

      const {
        coordinates,
      } = req.body;

      if (
        !isValidCoordinates(
          coordinates
        )
      ) {
        return res.status(400).json({
          message:
            "Valid coordinates required as [longitude, latitude]",
        });
      }

      const currentLocation =
        buildPoint(coordinates);

      const now = new Date();

      const mech =
        await Mechanic.findByIdAndUpdate(
          mechanicId,
          {
            $set: {
              currentLocation,
              lastLocationUpdate: now,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        ).select(
          "-password -refreshToken -otpHash -otpExpire"
        );

      if (!mech) {
        return res.status(404).json({
          message:
            "Mechanic not found",
        });
      }

      return res.json({
        success: true,
        message:
          "Current location updated",
        currentLocation:
          mech.currentLocation,
        lastLocationUpdate:
          mech.lastLocationUpdate,
      });
    } catch (err) {
      console.error(
        "updateCurrentLocation error:",
        err
      );

      return res.status(500).json({
        message:
          "Failed to update current location",
      });
    }
  };

// =========================================================
// ONLINE / OFFLINE
// =========================================================

export const updateMechanicAvailability =
  async (req, res) => {
    try {
      const mechanicId =
        req.mechanic.id;

      const {
        isOnline,
      } = req.body;

      if (
        typeof isOnline !== "boolean"
      ) {
        return res.status(400).json({
          message:
            "isOnline must be true or false",
        });
      }

      const mech =
        await Mechanic.findByIdAndUpdate(
          mechanicId,
          {
            $set: {
              isOnline,
            },
          },
          {
            new: true,
          }
        ).select(
          "name isOnline currentLocation lastLocationUpdate"
        );

      if (!mech) {
        return res.status(404).json({
          message:
            "Mechanic not found",
        });
      }

      return res.json({
        success: true,
        message: isOnline
          ? "You are now online"
          : "You are now offline",
        mechanic: mech,
      });
    } catch (err) {
      console.error(
        "updateMechanicAvailability error:",
        err
      );

      return res.status(500).json({
        message:
          "Failed to update availability",
      });
    }
  };

// =========================================================
// LOGOUT
// =========================================================

export const logout = async (
  req,
  res
) => {
  try {
    const token =
      req.cookies?.rr_refresh;

    if (token) {
      const decoded =
        jwt.decode(token);

      if (decoded?.id) {
        await Mechanic.findByIdAndUpdate(
          decoded.id,
          {
            $unset: {
              refreshToken: "",
            },

            $set: {
              isOnline: false,
            },
          }
        );
      }
    }

    res.clearCookie(
      "rr_refresh"
    );

    return res.json({
      success: true,
      message: "Logged out",
    });
  } catch (err) {
    console.error(
      "logout error:",
      err
    );

    return res.status(500).json({
      message: "Logout failed",
    });
  }
};

// =====================================================
// FIND NEARBY MECHANICS
// =====================================================

export const getNearbyMechanics = async (req, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query;

    const latitude = Number(lat);
    const longitude = Number(lng);
    const maxRadius = Number(radius);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required",
      });
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid location coordinates",
      });
    }

    const safeRadius =
      Number.isFinite(maxRadius) &&
      maxRadius > 0 &&
      maxRadius <= 200
        ? maxRadius
        : 50;

    const mechanics = await Mechanic.find({
      isVerified: true,
      isOnline: true,
      $or: [
        {
          "currentLocation.coordinates": {
            $exists: true,
          },
        },
        {
          "garageLocation.coordinates": {
            $exists: true,
          },
        },
      ],
    }).select(
      "name email phone garageName address profilePhoto isVerified isOnline currentLocation garageLocation"
    );

    const toRadians = (value) =>
      (value * Math.PI) / 180;

    const calculateDistance = (
      lat1,
      lon1,
      lat2,
      lon2
    ) => {
      const earthRadiusKm = 6371;

      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) *
          Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c =
        2 *
        Math.atan2(
          Math.sqrt(a),
          Math.sqrt(1 - a)
        );

      return earthRadiusKm * c;
    };

    const nearbyMechanics = mechanics
      .map((mechanic) => {
        let coordinates = null;

        // Prefer live/current location
        if (
          Array.isArray(
            mechanic.currentLocation?.coordinates
          ) &&
          mechanic.currentLocation.coordinates.length ===
            2
        ) {
          coordinates =
            mechanic.currentLocation.coordinates;
        }

        // Otherwise use permanent garage location
        if (
          !coordinates &&
          Array.isArray(
            mechanic.garageLocation?.coordinates
          ) &&
          mechanic.garageLocation.coordinates.length ===
            2
        ) {
          coordinates =
            mechanic.garageLocation.coordinates;
        }

        if (!coordinates) {
          return null;
        }

        const mechanicLongitude =
          Number(coordinates[0]);

        const mechanicLatitude =
          Number(coordinates[1]);

        if (
          !Number.isFinite(
            mechanicLongitude
          ) ||
          !Number.isFinite(
            mechanicLatitude
          )
        ) {
          return null;
        }

        const distance = calculateDistance(
          latitude,
          longitude,
          mechanicLatitude,
          mechanicLongitude
        );

        return {
          id: mechanic._id,
          name:
            mechanic.garageName?.trim() ||
            mechanic.name?.trim() ||
            "Roadside Mechanic",
          mechanicName:
            mechanic.name?.trim() ||
            "Mechanic",
          email: mechanic.email || "",
          phone: mechanic.phone || "",
          address:
            mechanic.address?.trim() ||
            "Location available",
          profilePhoto:
            mechanic.profilePhoto || "",
          available: mechanic.isOnline === true,
          verified:
            mechanic.isVerified === true,
          distance: Number(
            distance.toFixed(1)
          ),
          location: {
            lat: mechanicLatitude,
            lng: mechanicLongitude,
          },
        };
      })
      .filter(Boolean)
      .filter(
        (mechanic) =>
          mechanic.distance <= safeRadius
      )
      .sort(
        (a, b) =>
          a.distance - b.distance
      );

    return res.json({
      success: true,
      count: nearbyMechanics.length,
      radius: safeRadius,
      mechanics: nearbyMechanics,
    });
  } catch (error) {
    console.error(
      "getNearbyMechanics error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to find nearby mechanics",
    });
  }
};