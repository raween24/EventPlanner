// routes/adminRoutes.js
import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js"; 
import {
  getStats,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllEvents,
  deleteEvent,
  getAllResources,
  deleteResource,
  getAllDocuments,
  deleteDocument,
  validateDocument,
} from "../controller/Admincontroller.js";

const router = express.Router();

// Toutes les routes protégées : token valide + role admin
router.use(verifyToken, isAdmin);

// Stats dashboard
router.get("/stats", getStats);

// Users
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", updateUserRole);

// Events
router.get("/events", getAllEvents);
router.delete("/events/:id", deleteEvent);

// Resources
router.get("/resources", getAllResources);
router.delete("/resources/:id", deleteResource);

// Documents
router.get("/documents", getAllDocuments);
router.delete("/documents/:id", deleteDocument);
router.patch("/documents/:id/validate", validateDocument);

export default router;