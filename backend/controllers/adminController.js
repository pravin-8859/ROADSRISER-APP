import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Mechanic from "../models/Mechanic.js";
import Request from "../models/Request.js";
import {
  createAdminAccessToken,
  createAdminRefreshToken,
} from "../utils/adminToken.js";
import jwt from "jsonwebtoken";

// =====================================================
// ADMIN LOGIN
// =====================================================

export const adminLogin = async (req, res) => {
  try {
    const { email, password } =
      req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    const cleanEmail =
      email.trim().toLowerCase();

    const admin =
      await Admin.findOne({
        email: cleanEmail,
      });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid admin credentials",
      });
    }

    const match =
      await admin.matchPassword(
        password
      );

    if (!match) {
      return res.status(401).json({
        message: "Invalid admin credentials",
      });
    }

    const accessToken =
      createAdminAccessToken(
        admin._id
      );

    const refreshToken =
      createAdminRefreshToken(
        admin._id
      );

    res.cookie(
      "rr_admin_refresh",
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
        "Admin login successful",

      accessToken,

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(
      "adminLogin error:",
      error
    );

    return res.status(500).json({
      message: "Admin login failed",
    });
  }
};

// =====================================================
// ADMIN REFRESH TOKEN
// =====================================================

export const refreshAdminToken =
  async (req, res) => {
    try {
      const token =
        req.cookies?.rr_admin_refresh;

      if (!token) {
        return res.status(401).json({
          message:
            "Admin refresh token missing",
        });
      }

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_REFRESH_SECRET
        );

      if (
        decoded.type !== "admin" ||
        !decoded.id
      ) {
        return res.status(403).json({
          message:
            "Invalid admin refresh token",
        });
      }

      const admin =
        await Admin.findById(
          decoded.id
        );

      if (!admin) {
        return res.status(401).json({
          message:
            "Admin account not found",
        });
      }

      const accessToken =
        createAdminAccessToken(
          admin._id
        );

      return res.json({
        success: true,
        accessToken,
      });
    } catch (error) {
      console.error(
        "refreshAdminToken error:",
        error.message
      );

      return res.status(401).json({
        message:
          "Invalid or expired admin refresh token",
      });
    }
  };

// =====================================================
// ADMIN LOGOUT
// =====================================================

export const adminLogout = async (
  req,
  res
) => {
  try {
    res.clearCookie(
      "rr_admin_refresh"
    );

    return res.json({
      success: true,
      message: "Admin logged out",
    });
  } catch (error) {
    console.error(
      "adminLogout error:",
      error
    );

    return res.status(500).json({
      message: "Admin logout failed",
    });
  }
};

// =====================================================
// ADMIN PROFILE
// =====================================================

export const getAdminProfile =
  async (req, res) => {
    try {
      const admin =
        await Admin.findById(
          req.admin.id
        ).select(
          "-password"
        );

      if (!admin) {
        return res.status(404).json({
          message:
            "Admin not found",
        });
      }

      return res.json({
        success: true,
        admin,
      });
    } catch (error) {
      console.error(
        "getAdminProfile error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch admin profile",
      });
    }
  };

// =====================================================
// DASHBOARD
// =====================================================

export const getDashboardStats =
  async (req, res) => {
    try {
      const [
        totalUsers,
        totalMechanics,
        onlineMechanics,
        totalRequests,
        pendingRequests,
        acceptedRequests,
        enrouteRequests,
        completedRequests,
        cancelledRequests,
      ] = await Promise.all([
        User.countDocuments(),

        Mechanic.countDocuments(),

        Mechanic.countDocuments({
          isOnline: true,
        }),

        Request.countDocuments(),

        Request.countDocuments({
          status: "pending",
        }),

        Request.countDocuments({
          status: "accepted",
        }),

        Request.countDocuments({
          status: "enroute",
        }),

        Request.countDocuments({
          status: "completed",
        }),

        Request.countDocuments({
          status: "cancelled",
        }),
      ]);

      return res.json({
        success: true,

        stats: {
          totalUsers,
          totalMechanics,
          onlineMechanics,

          totalRequests,
          pendingRequests,
          acceptedRequests,
          enrouteRequests,
          completedRequests,
          cancelledRequests,
        },
      });
    } catch (error) {
      console.error(
        "getDashboardStats error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch dashboard statistics",
      });
    }
  };

// =====================================================
// GET USERS
// =====================================================

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -refreshToken")
      .sort({
        createdAt: -1,
      })
      .limit(200);

    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("getUsers error:", error);

    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

// =====================================================
// GET SINGLE USER
// =====================================================

export const getUserById =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid user ID",
        });
      }

      const user =
        await User.findById(id)
          .select(
            "-password"
          );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      const requests =
        await Request.find({
          user: id,
        })
          .populate(
            "mechanic",
            "name email phone garageName"
          )
          .sort({
            createdAt: -1,
          });

      return res.json({
        success: true,
        user,
        requests,
      });
    } catch (error) {
      console.error(
        "getUserById error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch user",
      });
    }
  };

// =====================================================
// GET MECHANICS
// =====================================================

export const getMechanics =
  async (req, res) => {
    try {
      const mechanics =
        await Mechanic.find()
          .select(
            "-password -refreshToken -otpHash -otpExpire"
          )
          .sort({
            createdAt: -1,
          })
          .limit(200);

      return res.json({
        success: true,
        mechanics,
      });
    } catch (error) {
      console.error(
        "getMechanics error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch mechanics",
      });
    }
  };

// =====================================================
// GET SINGLE MECHANIC
// =====================================================

export const getMechanicById =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid mechanic ID",
        });
      }

      const mechanic =
        await Mechanic.findById(
          id
        ).select(
          "-password -refreshToken -otpHash -otpExpire"
        );

      if (!mechanic) {
        return res.status(404).json({
          message:
            "Mechanic not found",
        });
      }

      const requests =
        await Request.find({
          mechanic: id,
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
        mechanic,
        requests,
      });
    } catch (error) {
      console.error(
        "getMechanicById error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch mechanic",
      });
    }
  };

// =====================================================
// GET REQUESTS
// =====================================================

export const getRequests =
  async (req, res) => {
    try {
      const requests =
        await Request.find()
          .populate(
            "user",
            "name email phone"
          )
          .populate(
            "mechanic",
            "name email phone garageName isOnline"
          )
          .sort({
            createdAt: -1,
          })
          .limit(500);

      return res.json({
        success: true,
        requests,
      });
    } catch (error) {
      console.error(
        "getRequests error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch requests",
      });
    }
  };

// =====================================================
// GET SINGLE REQUEST
// =====================================================

export const getRequestById =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid request ID",
        });
      }

      const request =
        await Request.findById(id)
          .populate(
            "user",
            "name email phone"
          )
          .populate(
            "mechanic",
            "name email phone garageName garageLocation currentLocation isOnline"
          );

      if (!request) {
        return res.status(404).json({
          message:
            "Request not found",
        });
      }

      return res.json({
        success: true,
        request,
      });
    } catch (error) {
      console.error(
        "getRequestById error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch request",
      });
    }
  };