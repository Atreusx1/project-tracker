import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/error';
import { UserModel } from '../models/userModel';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    const user = await UserModel.findById(decoded.id);

    if (!user || !user.isEmailConfirmed) {
      throw new AppError('Invalid or unconfirmed user', 401);
    }

    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (error) {
    next(new AppError('Authentication failed', 401));
  }
};
