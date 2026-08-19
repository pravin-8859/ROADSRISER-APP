import "dotenv/config";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

const createAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected"
    );

    const email =
      "admin@roadsriser.com";

    const existing =
      await Admin.findOne({
        email,
      });

    if (existing) {
      console.log(
        "Admin already exists"
      );

      await mongoose.disconnect();
      return;
    }

    const admin = new Admin({
      name: "RoadsRiser Admin",
      email,
      password: "Admin@12345",
      role: "admin",
    });

    await admin.save();

    console.log(
      "Admin created successfully"
    );

    console.log(
      "Email:",
      email
    );

    console.log(
      "Password: Admin@12345"
    );

    await mongoose.disconnect();
  } catch (error) {
    console.error(
      "Admin creation failed:",
      error
    );

    process.exit(1);
  }
};

createAdmin();