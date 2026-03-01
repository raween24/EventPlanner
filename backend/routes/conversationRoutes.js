import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createConversation,
  getUserConversations,
} from "../controller/conversationController.js";

const router = express.Router();

router.post("/", protect, createConversation);
router.get("/", protect, getUserConversations);

export default router;