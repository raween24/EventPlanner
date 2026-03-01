import express from "express";
import {
    createInvoice,
    getUserInvoices,
    getInvoiceById,
    updateInvoiceStatus,
    deleteInvoice
} from "../controller/invoiceController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createInvoice);
router.get("/", protect, getUserInvoices);
router.get("/:id", protect, getInvoiceById);
router.put("/:id/status", protect, updateInvoiceStatus);
router.delete("/:id", protect, deleteInvoice);

export default router;