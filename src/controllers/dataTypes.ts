import { DataTypes } from "../models/dataTypes";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const getAllDataTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dataTypes = await DataTypes.find({});
    res.status(200).json(dataTypes);
  } catch (error) {
    next(error);
  }
};

export const createDataType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const id = new mongoose.Types.ObjectId();
    const dataType = new DataTypes({ name, typeId: id, _id: id });
    await dataType.save();
    res.status(201).json(dataType);
  } catch (error) {
    next(error);
  }
};
