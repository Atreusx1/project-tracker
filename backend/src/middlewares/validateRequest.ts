import { Request, Response, NextFunction } from 'express';
import { z, AnyZodObject } from 'zod';
import { AppError } from '../utils/error';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(new AppError('Validation failed', 400));
    }
  };
};