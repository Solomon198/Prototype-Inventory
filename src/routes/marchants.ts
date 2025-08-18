import { createMarchant, getAllMarchants } from "../controllers/marchants";
import express from "express";

const router = express.Router();

router.get("/", getAllMarchants);

router.post("/", createMarchant);

export default router;
