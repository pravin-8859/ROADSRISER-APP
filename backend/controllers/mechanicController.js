import Mechanic from "../models/Mechanic.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Regex for GST validation (optional)
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

// Signup
export const mechanicSignup = async (req, res) => {
  const { name, email, password, phone, shopName, location, gstNumber, specialization, services, experience } = req.body;

  try {
    if (gstNumber && !gstRegex.test(gstNumber)) {
      return res.status(400).json({ error: "Invalid GST number" });
    }

    const existing = await Mechanic.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const mechanic = new Mechanic({
      name, email, password: hashedPassword, phone, shopName, location, gstNumber,
      specialization, services, experience
    });
    await mechanic.save();

    res.status(201).json({ message: "Mechanic registered successfully, pending admin approval" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
export const mechanicLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const mechanic = await Mechanic.findOne({ email });
    if (!mechanic) return res.status(404).json({ error: "Mechanic not found" });
    if (!mechanic.adminApproved) return res.status(403).json({ error: "Admin approval pending" });

    const isMatch = await bcrypt.compare(password, mechanic.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: mechanic._id, type: "mechanic" }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
