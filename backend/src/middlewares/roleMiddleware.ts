import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';
import { AuthRequest } from './authMiddleware';

export const roleMiddleware = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      throw new AppError('Insufficient permissions', 403);
    }
    next();
  };
};
