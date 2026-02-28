// backend/routes/googleAuthRoutes.js
import express from "express";
import { googleAuth } from "../controller/googleAuthController.js";

const router = express.Router();

// Une seule route claire et explicite
router.post("/google", googleAuth);

export default router;