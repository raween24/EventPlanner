import express from "express";
import {
    createComment,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment, getCommentsByResource
} from "../controller/commentController.js";

const router = express.Router();

router.post("/add", createComment);
router.get("/getall", getAllComments);
router.get("/get/:id", getCommentById);
router.get("/ressource/:id", getCommentsByResource);
router.put("/update/:id", updateComment);
router.delete("/del/:id", deleteComment);

export default router;