import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/test";
const email = process.env.ADMIN_EMAIL || "admin@roadsriser.local";
const pass = process.env.ADMIN_PASSWORD || "pnemea";

async function run(){
  await mongoose.connect(MONGO, { });
  const exist = await Admin.findOne({ email: email.toLowerCase() });
  if (exist) {
    console.log("Admin already exists:", exist.email);
    process.exit(0);
  }
  const admin = new Admin({ name: "Super Admin", email, password: pass });
  await admin.save();
  console.log("Admin created:", admin.email, "password:", pass);
  process.exit(0);
}
run().catch(e=>{ console.error(e); process.exit(1); });
