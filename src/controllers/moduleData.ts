import { NextFunction, Request, Response } from "express";
import { ModuleData } from "../models/moduleData";

export const createModuleData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { moduleId, data } = req.body;
    const moduleData = new ModuleData({ moduleId, data });
    await moduleData.save();
    res.status(201).json(moduleData);
  } catch (error) {
    next(error);
  }
};

export const getModuleData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { moduleId } = req.query;
    const moduleData = await ModuleData.find({ moduleId });
    res.status(200).json(moduleData);
  } catch (error) {
    next(error);
  }
};

export const getModuleDataById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const moduleData = await ModuleData.findById(id);
    if (!moduleData) {
      res.status(404).json({ message: "Module data not found" });
      return;
    }
    res.status(200).json(moduleData);
  } catch (error) {
    next(error);
  }
};

export const updateModuleData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const moduleData = await ModuleData.findByIdAndUpdate(
      id,
      { data },
      { new: true }
    );
    if (!moduleData) {
      return res.status(404).json({ message: "Module data not found" });
    }
    res.status(200).json(moduleData);
  } catch (error) {
    next(error);
  }
};

export const deleteModuleData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const moduleData = await ModuleData.findByIdAndDelete(id);
    if (!moduleData) {
      return res.status(404).json({ message: "Module data not found" });
    }
    res.status(200).json({ message: "Module data deleted successfully" });
  } catch (error) {
    next(error);
  }
};
