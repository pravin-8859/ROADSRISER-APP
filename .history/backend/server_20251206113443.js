// server.js (already like you had — keep)
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import mechanicRoutes from "./routes/mechanicRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";

dotenv.config();
const app = express();

const allowed = ["http://localhost:5173", "http://localhost:5174"];
app.use(cors({ origin: allowed, credentials: true }));

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/users", userRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api", adminRoutes);
app.use("/api/otp", otpRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
