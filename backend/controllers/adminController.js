import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

const signToken = (admin) => {
  return jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

// POST /api/admin/login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ message: "Email and password required" });

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(admin);

    // optional: set cookie for refresh token in production
    // res.cookie('admin_refresh', refreshToken, { httpOnly:true, secure: process.env.NODE_ENV==='production' });

    return res.json({
      message: "Login successful",
      accessToken: token,
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/stats (example protected route)
export const getStats = async (req, res) => {
  try {
    // sample stub - replace with real DB queries
    const stats = {
      users: await (await import("../models/User.js")).default.countDocuments().catch(()=>0),
      mechanics: await (await import("../models/Mechanic.js")).default.countDocuments().catch(()=>0),
      requestsToday: 12 // replace
    };
    res.json({ stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
