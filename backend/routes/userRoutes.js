import express from "express";
import { registerUser, getUser, loginUser, updateUser } from "../controller/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/allusers", getUser);
router.get("/login/:email/:password", loginUser);
router.put("/updateuser/:identifiant", updateUser);
export default router;
