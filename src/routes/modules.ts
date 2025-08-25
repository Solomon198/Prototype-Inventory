import {
  createModule,
  getAllModules,
  deleteModule,
  updateModule,
} from "../controllers/modules";
import express from "express";

const router = express.Router();

router.get("/", getAllModules);

router.post("/", createModule);

router.delete("/:id", deleteModule);

router.put("/:id", updateModule);

export default router;
