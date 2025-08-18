import { Fields } from "../models/fields";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const getAllFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { moduleId, merchantId } = req.query;
  try {
    const query = {
      ...(moduleId
        ? { moduleId: new mongoose.Types.ObjectId(moduleId as string) }
        : {}),
      ...(merchantId
        ? { merchantId: new mongoose.Types.ObjectId(merchantId as string) }
        : {}),
    };
    const fields = await Fields.find(query)
      .populate("type")
      .populate("merchantId")
      .populate("moduleId");
    res.status(200).json(fields);
  } catch (error) {
    next(error);
  }
};

export const createField = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, type, moduleId, merchantId } = req.body;
    const id = new mongoose.Types.ObjectId();
    const field = new Fields({
      name,
      type: new mongoose.Types.ObjectId(type),
      fieldId: id,
      _id: id,
      moduleId: new mongoose.Types.ObjectId(moduleId),
      merchantId: new mongoose.Types.ObjectId(merchantId),
    });
    await field.save();
    res.status(201).json(field);
  } catch (error) {
    next(error);
  }
};
