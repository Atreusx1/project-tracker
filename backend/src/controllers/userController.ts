import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/userModel';
import { AppError } from '../utils/error';
import { AuthRequest } from '../middlewares/authMiddleware';

export class UserController {
  getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user!.role !== 'admin') {
        throw new AppError('Admin access required', 403);
      }
      const users = await UserModel.find().select('_id email');
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };
}