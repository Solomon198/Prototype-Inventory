import { Request, Response, NextFunction } from "express";
import { Modules } from "../models/modules";
import mongoose from "mongoose";
import { Fields } from "../models/fields";

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
    const { name, merchantId, relationships } = req.body;
    const id = new mongoose.Types.ObjectId();
    const module = new Modules({
      name,
      merchantId,
      _id: id,
      moduleId: id,
      relationships,
    });
    await module.save();

    const $modules = await Modules.find({ merchantId }).populate("merchantId");
    res.status(201).json($modules);
  } catch (error) {
    next(error);
  }
};

export const deleteModule = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: moduleId } = req.params;
    const module = await Modules.findByIdAndDelete(
      new mongoose.Types.ObjectId(moduleId)
    );
    await Fields.deleteMany({
      moduleId: new mongoose.Types.ObjectId(moduleId),
    });
    if (!module) {
      res.status(404).json({ message: "Module not found" });
    } else {
      res.status(200).json({ message: "Module deleted successfully" });
    }
  } catch (error) {
    next(error);
  }
};

export const updateModule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, relationships } = req.body;
    console.log(req.body);
    const module = await Modules.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      { name, relationships },
      { new: true }
    );
    res.status(200).json(module);
  } catch (error) {
    next(error);
  }
};
