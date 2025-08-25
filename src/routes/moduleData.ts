import {
  createModuleData,
  getModuleData,
  getModuleDataById,
  updateModuleData,
  deleteModuleData,
} from "../controllers/moduleData";
import express from "express";

const router = express.Router();

router.get("/", getModuleData);
router.get("/:id", getModuleDataById);

router.post("/", createModuleData);
router.put("/:id", updateModuleData);
router.delete("/:id", deleteModuleData);

export default router;
