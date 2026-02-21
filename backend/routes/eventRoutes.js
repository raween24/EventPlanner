import express from "express";
import { addEvent, get_all_Event, get_event_by_id, updateEvent, deleteEvent } from "../controller/eventController.js";

const router = express.Router();
router.post("/addEvent", addEvent);
router.get("/allEvent", get_all_Event);
router.get("/Event/:id", get_event_by_id);
router.put("/update_event/:id", updateEvent);
router.delete("/dell_event/:id", deleteEvent);
export default router;