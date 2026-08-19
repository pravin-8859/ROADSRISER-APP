import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Admin authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Admin token missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    if (
      decoded.type !== "admin" ||
      !decoded.id
    ) {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    const admin = await Admin.findById(
      decoded.id
    ).select("-password");

    if (!admin) {
      return res.status(401).json({
        message: "Admin account not found",
      });
    }

    req.admin = admin;

    next();
  } catch (error) {
    console.error(
      "verifyAdmin error:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid or expired admin token",
    });
  }
};