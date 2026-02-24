import express from "express";
import {
  registerUser,
  getUser,
  loginUser,
  updateUser,
} from "../controller/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/allusers", getUser);
router.put("/updateuser/:identifiant", updateUser);

export default router;