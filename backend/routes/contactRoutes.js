import express from "express";

import {
  createContactMessage,
  getContactMessages,
  updateContactMessageStatus
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContactMessage);

router.get("/", getContactMessages);

router.put(
  "/:id/status",
  updateContactMessageStatus
);

export default router;