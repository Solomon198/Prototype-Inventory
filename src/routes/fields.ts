import { createField, getAllFields } from "../controllers/fields";
import express from "express";

const router = express.Router();

router.get("/", getAllFields);

router.post("/", createField);

export default router;
