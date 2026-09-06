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

const normalizePhone = (raw = "") => {
  const digits = String(raw).replace(/\D/g, "");
  return digits ? digits.slice(-10) : "";
};

const cleanEmail = (raw = "") =>
  String(raw).toLowerCase().trim();

const getMechanicId = (req) =>
  req.mechanic?.id || req.mechanic?._id;

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

const safeMechanic = (mechanic) => {
  if (!mechanic) return null;

  const data = mechanic.toObject
    ? mechanic.toObject()
    : { ...mechanic };

  delete data.password;
  delete data.refreshToken;
  delete data.otpHash;
  delete data.otpExpire;
  delete data.otpAttempts;
  delete data.resetOtpHash;
  delete data.resetOtpExpire;
  delete data.resetOtpAttempts;
  delete data.resetTokenHash;
  delete data.resetTokenExpire;

  return data;
};

const refreshCookieOptions = {
  httpOnly: true,
  sameSite:
    process.env.NODE_ENV === "production"
      ? "strict"
      : "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const setRefreshCookie = (res, token) => {
  res.cookie(
    "rr_refresh",
    token,
    refreshCookieOptions
  );
};

const clearRefreshCookie = (res) => {
  res.clearCookie("rr_refresh", {
    httpOnly: true,
    sameSite:
      process.env.NODE_ENV === "production"
        ? "strict"
        : "lax",
    secure: process.env.NODE_ENV === "production",
  });
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

    const emailAddress = cleanEmail(email);
    const phone = normalizePhone(rawPhone);

    if (!emailAddress && !phone) {
      return res.status(400).json({
        success: false,
        message: "Email or phone is required",
      });
    }

    if (
      emailAddress &&
      !/^\S+@\S+\.\S+$/.test(emailAddress)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid email required",
      });
    }

    if (
      phone &&
      !/^\d{10}$/.test(phone)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid phone number required",
      });
    }

    /*
      Current project has email OTP implementation.
      Phone OTP service is not connected yet.
    */

    if (!emailAddress) {
      return res.status(501).json({
        success: false,
        message:
          "Phone OTP service is not configured. Please use email OTP.",
      });
    }

    const otp = generateOtp(6);
    const otpHash = await hashOtp(otp);

    const otpExpire = new Date(
      Date.now() + 5 * 60 * 1000
    );

    let mechanic = await Mechanic.findOne({
      email: emailAddress,
    });

    if (mechanic?.isVerified) {
      return res.status(400).json({
        success: false,
        message:
          "Account already registered. Please login.",
      });
    }

    if (!mechanic) {
      mechanic = new Mechanic({
        email: emailAddress,
      });
    }

    mechanic.otpHash = otpHash;
    mechanic.otpExpire = otpExpire;
    mechanic.otpAttempts = 0;
    mechanic.isVerified = false;

    await mechanic.save({
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

    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (err) {
    console.error("sendOtp error:", err);

    return res.status(500).json({
      success: false,
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

    // ================= OTP VALIDATION =================

    if (
      !otp ||
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid 6-digit OTP required",
      });
    }

    // ================= PASSWORD VALIDATION =================

    if (
      !password ||
      typeof password !== "string" ||
      password.length < 6
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    // ================= NAME VALIDATION =================

    if (
      !name ||
      typeof name !== "string" ||
      name.trim().length < 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid name is required",
      });
    }

    // ================= NORMALIZE =================

    const emailAddress = cleanEmail(email);
    const phone = normalizePhone(rawPhone);

    if (
      !emailAddress ||
      !/^\S+@\S+\.\S+$/.test(emailAddress)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    if (
      phone &&
      !/^\d{10}$/.test(phone)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number must contain 10 digits",
      });
    }

    // ================= FIND OTP RECORD =================

    let mechanic = await Mechanic.findOne({
      email: emailAddress,
    });

    if (mechanic?.isVerified) {
      return res.status(400).json({
        success: false,
        message:
          "Account already registered. Please login.",
      });
    }

    if (!mechanic) {
      return res.status(400).json({
        success: false,
        message: "Please request OTP first",
      });
    }

    if (
      !mechanic.otpHash ||
      !mechanic.otpExpire
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP not requested",
      });
    }

    // ================= OTP EXPIRY =================

    if (
      new Date() > new Date(mechanic.otpExpire)
    ) {
      mechanic.otpHash = null;
      mechanic.otpExpire = null;
      mechanic.otpAttempts = 0;

      await mechanic.save({
        validateBeforeSave: false,
      });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // ================= OTP ATTEMPT LIMIT =================

    if (
      Number(mechanic.otpAttempts || 0) >= 5
    ) {
      mechanic.otpHash = null;
      mechanic.otpExpire = null;
      mechanic.otpAttempts = 0;

      await mechanic.save({
        validateBeforeSave: false,
      });

      return res.status(429).json({
        success: false,
        message:
          "Too many invalid OTP attempts. Please request a new OTP.",
      });
    }

    // ================= VERIFY OTP =================

    const validOtp = await verifyOtpHash(
      otp,
      mechanic.otpHash
    );

    if (!validOtp) {
      mechanic.otpAttempts =
        Number(mechanic.otpAttempts || 0) + 1;

      if (mechanic.otpAttempts >= 5) {
        mechanic.otpHash = null;
        mechanic.otpExpire = null;
        mechanic.otpAttempts = 0;

        await mechanic.save({
          validateBeforeSave: false,
        });

        return res.status(429).json({
          success: false,
          message:
            "Too many invalid OTP attempts. Please request a new OTP.",
        });
      }

      await mechanic.save({
        validateBeforeSave: false,
      });

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ================= PHONE DUPLICATE CHECK =================

    if (phone) {
      const existingPhone =
        await Mechanic.findOne({
          phone,
          _id: {
            $ne: mechanic._id,
          },
          isVerified: true,
        });

      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone already registered",
        });
      }

      mechanic.phone = phone;
    }

    // ================= BASIC DATA =================

    mechanic.name = name.trim();
    mechanic.email = emailAddress;
    mechanic.password = password;
    mechanic.gst = gst?.trim() || "";
    mechanic.garageName =
      garageName?.trim() || "";
    mechanic.address =
      address?.trim() || "";

    // ================= GARAGE LOCATION =================

    if (garageLocation?.coordinates) {
      if (
        !isValidCoordinates(
          garageLocation.coordinates
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid coordinates required as [longitude, latitude]",
        });
      }

      mechanic.garageLocation = buildPoint(
        garageLocation.coordinates
      );
    }

    // ================= VERIFY ACCOUNT =================

    mechanic.isVerified = true;
    mechanic.otpHash = null;
    mechanic.otpExpire = null;
    mechanic.otpAttempts = 0;

    await mechanic.save();

    // ================= TOKEN GENERATION =================

    const accessToken = createAccessToken(mechanic._id);

    const refreshToken = createRefreshToken(mechanic._id);

    mechanic.refreshToken = refreshToken;
    await mechanic.save();

    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      success: true,
      message:
        "Mechanic registered successfully",
      accessToken,
      mechanic: safeMechanic(mechanic),
    });
  } catch (err) {
    console.error(
      "mechanicSignup error:",
      err
    );

    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Email or phone already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};
// =========================================================
// MECHANIC LOGIN
// =========================================================

export const mechanicLogin = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const emailAddress = cleanEmail(email);

    if (
      !emailAddress ||
      !/^\S+@\S+\.\S+$/.test(emailAddress)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    if (
      !password ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const mechanic = await Mechanic.findOne({
      email: emailAddress,
    });

    if (!mechanic) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid =
      await mechanic.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!mechanic.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Account is not verified. Please verify your OTP.",
      });
    }

    const accessToken = createAccessToken(mechanic._id);

    const refreshToken = createRefreshToken(mechanic._id);

    mechanic.refreshToken = refreshToken;

    await mechanic.save({
      validateBeforeSave: false,
    });

    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      mechanic: safeMechanic(mechanic),
    });
  } catch (err) {
    console.error(
      "mechanicLogin error:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// =========================================================
// REFRESH MECHANIC ACCESS TOKEN
// =========================================================

export const refreshMechanicToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies?.rr_refresh;

    if (!oldRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(
        oldRefreshToken,
        process.env.JWT_REFRESH_SECRET
      );
    } catch (err) {
      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    if (!decoded?.id || decoded.type !== "mechanic") {
      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const mechanic = await Mechanic.findOne({
      _id: decoded.id,
      refreshToken: oldRefreshToken,
      isVerified: true,
    });

    if (!mechanic) {
      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "Refresh token is not valid",
      });
    }

    const newAccessToken = createAccessToken(mechanic._id);
    const newRefreshToken = createRefreshToken(mechanic._id);

    mechanic.refreshToken = newRefreshToken;

    await mechanic.save({
      validateBeforeSave: false,
    });

    setRefreshCookie(res, newRefreshToken);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error("refreshMechanicToken error:", err);

    clearRefreshCookie(res);

    return res.status(500).json({
      success: false,
      message: "Failed to refresh token",
    });
  }
};
// =========================================================
// GET MECHANIC PROFILE
// =========================================================

export const getMechanicProfile = async (
  req,
  res
) => {
  try {
    const mechanicId = getMechanicId(req);

    if (!mechanicId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const mechanic = await Mechanic.findById(
      mechanicId
    );

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "Mechanic not found",
      });
    }

    return res.status(200).json({
      success: true,
      mechanic: safeMechanic(mechanic),
    });
  } catch (err) {
    console.error(
      "getMechanicProfile error:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get mechanic profile",
    });
  }
};
// =========================================================
// UPDATE MECHANIC PROFILE
// =========================================================

export const updateMechanicProfile = async (
  req,
  res
) => {
  try {
    const mechanicId = getMechanicId(req);

    if (!mechanicId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      name,
      phone: rawPhone,
      gst,
      garageName,
      address,
      profilePhoto,
    } = req.body;

    const mechanic = await Mechanic.findById(
      mechanicId
    );

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "Mechanic not found",
      });
    }

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        name.trim().length < 2
      ) {
        return res.status(400).json({
          success: false,
          message: "Valid name is required",
        });
      }

      mechanic.name = name.trim();
    }

    if (rawPhone !== undefined) {
      const phone = normalizePhone(rawPhone);

      if (
        phone &&
        !/^\d{10}$/.test(phone)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Phone number must contain 10 digits",
        });
      }

      if (phone) {
        const existingPhone =
          await Mechanic.findOne({
            phone,
            _id: {
              $ne: mechanic._id,
            },
            isVerified: true,
          });

        if (existingPhone) {
          return res.status(400).json({
            success: false,
            message: "Phone already registered",
          });
        }

        mechanic.phone = phone;
      } else {
        mechanic.phone = undefined;
      }
    }

    if (gst !== undefined) {
      mechanic.gst =
        typeof gst === "string"
          ? gst.trim()
          : "";
    }

    if (garageName !== undefined) {
      mechanic.garageName =
        typeof garageName === "string"
          ? garageName.trim()
          : "";
    }

    if (address !== undefined) {
      mechanic.address =
        typeof address === "string"
          ? address.trim()
          : "";
    }

    if (profilePhoto !== undefined) {
      mechanic.profilePhoto =
        typeof profilePhoto === "string"
          ? profilePhoto.trim()
          : "";
    }

    await mechanic.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      mechanic: safeMechanic(mechanic),
    });
  } catch (err) {
    console.error(
      "updateMechanicProfile error:",
      err
    );

    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Phone already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// =========================================================
// UPDATE GARAGE LOCATION
// =========================================================

export const updateGarageLocation = async (
  req,
  res
) => {
  try {
    const mechanicId = getMechanicId(req);

    if (!mechanicId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      coordinates,
    } = req.body;

    if (
      !isValidCoordinates(coordinates)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Coordinates must be [longitude, latitude]",
      });
    }

    const mechanic =
      await Mechanic.findByIdAndUpdate(
        mechanicId,
        {
          garageLocation:
            buildPoint(coordinates),
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "Mechanic not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Garage location updated successfully",
      mechanic: safeMechanic(mechanic),
    });
  } catch (err) {
    console.error(
      "updateGarageLocation error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update garage location",
    });
  }
};

// =========================================================
// UPDATE CURRENT LOCATION
// =========================================================

export const updateCurrentLocation = async (
  req,
  res
) => {
  try {
    const mechanicId = getMechanicId(req);

    if (!mechanicId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      coordinates,
    } = req.body;

    if (
      !isValidCoordinates(coordinates)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Coordinates must be [longitude, latitude]",
      });
    }

    const mechanic =
      await Mechanic.findByIdAndUpdate(
        mechanicId,
        {
          currentLocation:
            buildPoint(coordinates),
          lastLocationUpdate: new Date(),
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "Mechanic not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Current location updated successfully",
      mechanic: safeMechanic(mechanic),
    });
  } catch (err) {
    console.error(
      "updateCurrentLocation error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update current location",
    });
  }
};
// =========================================================
// UPDATE MECHANIC AVAILABILITY
// =========================================================

export const updateMechanicAvailability = async (
  req,
  res
) => {
  try {
    const mechanicId = getMechanicId(req);

    if (!mechanicId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      isOnline,
    } = req.body;

    if (typeof isOnline !== "boolean") {
      return res.status(400).json({
        success: false,
        message:
          "isOnline must be true or false",
      });
    }

    const mechanic = await Mechanic.findById(
      mechanicId
    );

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "Mechanic not found",
      });
    }

    if (isOnline) {
      const coordinates =
        mechanic.garageLocation?.coordinates;

      if (
        !isValidCoordinates(coordinates)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please update your garage location before going online",
        });
      }
    }

    mechanic.isOnline = isOnline;

    await mechanic.save({
      validateBeforeSave: false,
    });

    return res.status(200).json({
      success: true,
      message: isOnline
        ? "Mechanic is now online"
        : "Mechanic is now offline",
      isOnline: mechanic.isOnline,
    });
  } catch (err) {
    console.error(
      "updateMechanicAvailability error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update availability",
    });
  }
};

// =========================================================
// LOGOUT
// =========================================================

export const logout = async (req, res) => {
  try {
    const mechanicId = getMechanicId(req);

    if (mechanicId) {
      await Mechanic.findByIdAndUpdate(
        mechanicId,
        {
          $unset: {
            refreshToken: 1,
          },
          isOnline: false,
        }
      );
    }

    clearRefreshCookie(res);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    console.error("logout error:", err);

    clearRefreshCookie(res);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// =========================================================
// GET NEARBY MECHANICS
// =========================================================

export const getNearbyMechanics = async (
  req,
  res
) => {
  try {
    const {
      lat,
      lng,
      radius = 50,
    } = req.query;

    const latitude = Number(lat);
    const longitude = Number(lng);
    const maxRadius = Number(radius);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid latitude and longitude are required",
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
        message: "Invalid coordinates",
      });
    }

    if (
      !Number.isFinite(maxRadius) ||
      maxRadius <= 0 ||
      maxRadius > 200
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Radius must be between 1 and 200 kilometers",
      });
    }

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
    });

    const toRadians = (value) =>
      (value * Math.PI) / 180;

    const calculateDistance = (
      lat1,
      lng1,
      lat2,
      lng2
    ) => {
      const earthRadius = 6371;

      const dLat = toRadians(lat2 - lat1);
      const dLng = toRadians(lng2 - lng1);

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLng / 2) ** 2;

      const c =
        2 *
        Math.atan2(
          Math.sqrt(a),
          Math.sqrt(1 - a)
        );

      return earthRadius * c;
    };

    const now = Date.now();
    const liveLocationLimit = 2 * 60 * 1000;

    const nearbyMechanics = [];

    for (const mechanic of mechanics) {
      let coordinates = null;
      let locationType = "garage";

      const currentCoordinates =
        mechanic.currentLocation?.coordinates;

      const garageCoordinates =
        mechanic.garageLocation?.coordinates;

      const lastLocationUpdate =
        mechanic.lastLocationUpdate
          ? new Date(
              mechanic.lastLocationUpdate
            ).getTime()
          : 0;

      const isLiveLocationFresh =
        lastLocationUpdate > 0 &&
        now - lastLocationUpdate <=
          liveLocationLimit;

      if (
        isLiveLocationFresh &&
        isValidCoordinates(currentCoordinates)
      ) {
        coordinates = currentCoordinates;
        locationType = "current";
      } else if (
        isValidCoordinates(garageCoordinates)
      ) {
        coordinates = garageCoordinates;
        locationType = "garage";
      }

      if (!coordinates) {
        continue;
      }

      const mechanicLongitude =
        Number(coordinates[0]);

      const mechanicLatitude =
        Number(coordinates[1]);

      const distance = calculateDistance(
        latitude,
        longitude,
        mechanicLatitude,
        mechanicLongitude
      );

      if (distance <= maxRadius) {
        nearbyMechanics.push({
          id: mechanic._id,
          name: mechanic.name,
          phone: mechanic.phone,
          garageName: mechanic.garageName,
          address: mechanic.address,
          profilePhoto: mechanic.profilePhoto,
          isOnline: mechanic.isOnline,
          locationType,
          coordinates: [
            mechanicLongitude,
            mechanicLatitude,
          ],
          distance: Number(
            distance.toFixed(2)
          ),
        });
      }
    }

    nearbyMechanics.sort(
      (a, b) => a.distance - b.distance
    );

    return res.status(200).json({
      success: true,
      count: nearbyMechanics.length,
      mechanics: nearbyMechanics,
    });
  } catch (err) {
    console.error(
      "getNearbyMechanics error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch nearby mechanics",
    });
  }
};