import express from "express";
import {
  sendOtp,
  registerUser,
  loginUser,
} from "../controllers/userAuthController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/register", registerUser);
router.post("/login", loginUser);



export default router;
