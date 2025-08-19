import { Marchants } from "../models/marchants";
import { Request, Response, NextFunction } from "express";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name } = req.body;
  const user = await Marchants.findOne({ name });
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
  } else {
    res.status(200).json({ message: "Login successful", user });
  }
};
