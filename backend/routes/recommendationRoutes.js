import express from "express";
import { recommend } from "../controller/recommendationController.js";

const router = express.Router();

// ✅ sans user
router.get("/", recommend);

// ✅ avec user
router.get("/:userId", recommend);

// ✅ avec user + event
router.get("/:userId/:eventId", recommend);

export default router;