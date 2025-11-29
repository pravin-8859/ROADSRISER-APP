import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import cors from
import userRoutes from "./routes/userRoutes.js";
import mechanicRoutes from "./routes/mechanicRoutes.js";

dotenv.config();
const app = express();

// ---------------------------
// 🔥 CORS FIX (MOST IMPORTANT)
// ---------------------------
const allowed = ["http://localhost:5173", "http://localhost:5174"];
app.use(
  cors({
    origin: allowed,
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());

// ---------------------------
// 🔥 MONGO CONNECTION
// ---------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

// ---------------------------
// 🔥 API ROUTES
// ---------------------------
app.use("/api/users", userRoutes);
app.use("/api/mechanics", mechanicRoutes);  // ✔ Correct path

// ---------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
