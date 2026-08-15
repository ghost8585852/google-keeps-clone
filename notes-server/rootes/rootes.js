import express from "express";
import { createNotes , getAllNotes, DeleteNote, UpdateNotes } from "../controllers/noteController.js";


const router = express.Router();

router.post("/",createNotes);

router.get("/",getAllNotes);

router.delete("/",DeleteNote);

router.patch("/:id",UpdateNotes);

export default router;