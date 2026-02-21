import express from "express";
import {
    addResource,
    getAllResources,
    getResourceById,
    updateResource,
    deleteResource
} from "../controller/ressourcesController.js";

const router = express.Router();

router.post("/add_ressource", addResource);
router.get("/get_all_ressources", getAllResources);
router.get("/get_by_id/:id", getResourceById);
router.put("/modify/:id", updateResource);
router.delete("/dell/:id", deleteResource);

export default router;