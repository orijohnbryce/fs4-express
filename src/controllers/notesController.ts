import { Router, Request, Response } from "express";
import { createNote, getNotes } from "../services/notesServices";
// import * as notesService from "../services/notesServices";

const router = Router();

// GET all notes
router.get("/", async (req: Request, res: Response) => {
    const notes = await getNotes();
    res.json(notes);
});

// GET by id
router.get("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const note = await getNotes(id);

    if (!note) return res.status(404).send("Not found");
    res.json(note);
});

// POST create note
router.post("/", async (req: Request, res: Response) => {
    const id = await createNote(req.body);
    res.status(201).json({ id });
});

export default router;
