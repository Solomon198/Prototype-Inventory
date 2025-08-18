import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
};
