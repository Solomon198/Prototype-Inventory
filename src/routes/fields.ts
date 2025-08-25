import { createField, deleteField, getAllFields } from "../controllers/fields";
import express from "express";

const router = express.Router();

router.get("/", getAllFields);

router.post("/", createField);

router.delete("/:id", deleteField);

export default router;
