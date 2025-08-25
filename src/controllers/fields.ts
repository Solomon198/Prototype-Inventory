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
    const { name, type, moduleId, merchantId, isLabel, typeSchema } = req.body;
    const id = new mongoose.Types.ObjectId();
    const field = new Fields({
      name,
      type: new mongoose.Types.ObjectId(type),
      fieldId: id,
      _id: id,
      isLabel,
      moduleId: new mongoose.Types.ObjectId(moduleId),
      merchantId: new mongoose.Types.ObjectId(merchantId),
      ...(typeSchema && { typeSchema }),
    });
    await field.save();
    res.status(201).json(field);
  } catch (error) {
    next(error);
  }
};

export const deleteField = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const field = await Fields.findByIdAndDelete(
      new mongoose.Types.ObjectId(id)
    );
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }
    res.status(200).json({ message: "Field deleted successfully" });
  } catch (error) {
    next(error);
  }
};
