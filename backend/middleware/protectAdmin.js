import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protectAdmin = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) return res.status(401).json({ message: "Invalid token" });

    const admin = await Admin.findById(decoded.id);
    if (!admin || admin.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    req.admin = admin; // attach admin
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Not authorized" });
  }
};
