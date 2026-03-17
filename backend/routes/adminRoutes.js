// routes/adminRoutes.js
import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import {
  getStats,
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getAllEvents,
  deleteEvent,
  getAllResources,
  deleteResource,
  getResourcePaniers,
} from "../controller/Admincontroller.js";

const router = express.Router();

router.use(verifyToken, isAdmin);

// Stats
router.get("/stats",getStats);

// Users
router.get("/users",getAllUsers);
router.delete("/users/:id",deleteUser);
router.patch("/users/:id/status",updateUserStatus);   

// Events
router.get("/events",getAllEvents);
router.delete("/events/:id",deleteEvent);

// Resources
router.get("/resources",getAllResources);
router.delete("/resources/:id",deleteResource);
router.get("/resources/:id/paniers",getResourcePaniers); 

export default router;