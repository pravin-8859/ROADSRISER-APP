import "dotenv/config";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const email = "admin@roadsriser.com";
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
      throw new Error("ADMIN_PASSWORD is missing");
    }

    if (password.length < 8) {
      throw new Error("ADMIN_PASSWORD must be at least 8 characters");
    }

    const existing = await Admin.findOne({ email });

    if (existing) {
      console.log("Admin already exists. Updating password...");

      existing.password = password;
      await existing.save();

      console.log("Admin password updated successfully");

      await mongoose.disconnect();
      return;
    }

    const admin = new Admin({
      name: "RoadsRiser Admin",
      email,
      password,
      role: "admin",
    });

    await admin.save();

    console.log("Admin created successfully");
    console.log("Email:", email);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Admin setup failed:", error);
    process.exit(1);
  }
};

createAdmin();