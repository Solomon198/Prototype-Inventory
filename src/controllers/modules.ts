import { Request, Response, NextFunction } from "express";
import { Modules } from "../models/modules";
import mongoose from "mongoose";

export const getAllModules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { merchantId } = req.query;
    const modules = await Modules.find(
      merchantId
        ? { merchantId: new mongoose.Types.ObjectId(merchantId as string) }
        : {}
    ).populate("merchantId");
    res.status(200).json(modules);
  } catch (error) {
    next(error);
  }
};

export const createModule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, merchantId } = req.body;
    const id = new mongoose.Types.ObjectId();
    const module = new Modules({ name, merchantId, _id: id, moduleId: id });
    await module.save();

    const $modules = await Modules.find({ merchantId }).populate("merchantId");
    res.status(201).json($modules);
  } catch (error) {
    next(error);
  }
};
