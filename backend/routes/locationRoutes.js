import express from "express";
import {
  createLocation,
  getMyLocations,
  
  updateLocationStatus,
  deleteLocation
} from "../controller/locationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", verifyToken, createLocation);
router.get("/get", verifyToken, getMyLocations);
router.put("/update/:id", verifyToken, updateLocationStatus);
router.delete("/del/:id", verifyToken, deleteLocation);
export default router;