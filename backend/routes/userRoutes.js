import express from "express";
import {
  registerUser,
  getUser,
  loginUser,
  updateUser, addToAdore,
  removeFromAdore,
  getAdore, getUserById
} from "../controller/userController.js";
import upload from "../middleware/upload_image.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("image"), registerUser);
router.post("/login", loginUser);
router.get("/allusers", getUser);
router.post("/like", addToAdore);
router.delete("/remove", removeFromAdore);
router.get("/panier/:userId", getAdore);
router.get("/:id", getUserById);
router.put('/update', verifyToken, upload.single('image'), updateUser);

export default router;