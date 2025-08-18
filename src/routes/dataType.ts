import express from "express";
import { createDataType, getAllDataTypes } from "../controllers/dataTypes";

const router = express.Router();

router.get("/", getAllDataTypes);

router.post("/", createDataType);

export default router;
