import { Marchants } from "../models/marchants";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const getAllMarchants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const marchants = await Marchants.find({});
    res.status(200).json(marchants);
  } catch (error) {
    next(error);
  }
};

export const createMarchant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const id = new mongoose.Types.ObjectId();
    const marchant = new Marchants({ name, _id: id, merchantId: id });
    await marchant.save();
    res.status(201).json(marchant);
  } catch (error) {
    next(error);
  }
};
