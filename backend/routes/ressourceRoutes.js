import express from "express";
import multer from "multer";
import {
    addResource,
    getAllResources,
    getResourceById,
    updateResource,
    deleteResource, getResourcesByUser
} from "../controller/ressourcesController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

/* ================= AJOUTER RESSOURCE ================= */
router.post("/add_ressource", verifyToken, upload.array("media"), addResource);

/* ================= VOIR TOUTES LES RESSOURCES ================= */
router.get("/get_all_ressources", getAllResources);

/* ================= VOIR UNE RESSOURCE PAR ID ================= */
router.get("/get_by_id/:id", getResourceById);

/* ================= MODIFIER RESSOURCE ================= */
router.put("/modify/:id", verifyToken, updateResource);

/* ================= SUPPRIMER RESSOURCE ================= */
router.delete("/dell/:id", verifyToken, deleteResource);
router.get("/res_user", verifyToken, getResourcesByUser);

export default router;