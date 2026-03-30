import express from "express";
import {
  createLocation,
  getMyLocations,
  getLocationsForProvider,
  updateLocationStatus,
  deleteLocation, updateStatusByProvider
} from "../controller/locationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", verifyToken, createLocation);
router.get("/get", verifyToken, getMyLocations);
router.get("/get_pres", verifyToken, getLocationsForProvider);
router.put("/update/:id", verifyToken, updateLocationStatus);
router.put("/update_pres/:id", verifyToken, updateStatusByProvider);
router.delete("/del/:id", verifyToken, deleteLocation);
export default router;