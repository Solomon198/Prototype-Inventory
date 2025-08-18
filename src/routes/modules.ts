import { createModule, getAllModules } from "../controllers/modules";
import express from "express";

const router = express.Router();

router.get("/", getAllModules);

router.post("/", createModule);

export default router;
