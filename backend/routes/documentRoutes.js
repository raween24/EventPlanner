import express from "express";
import {
    createDocument,
    getUserDocuments,
    getDocumentById,
    deleteDocument
} from "../controller/documentController.js";

import upload from "../middleware/upload_doc.js"; // Multer

const router = express.Router();

/* ================= CREATE DOCUMENT ================= */
// Upload fichier (single file nommé "file")
router.post("/", upload.single("file"), createDocument);

/* ================= GET USER DOCUMENTS ================= */
router.get("/", getUserDocuments);

/* ================= GET SINGLE DOCUMENT ================= */
router.get("/:id", getDocumentById);

/* ================= DELETE DOCUMENT ================= */
router.delete("/:id", deleteDocument);

export default router;