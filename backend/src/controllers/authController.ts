import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AppError } from '../utils/error';
import { validateRequest } from '../middlewares/validateRequest';
import { registerSchema, loginSchema } from '../utils/validators';
import { UserModel } from '../models/userModel'; // Import UserModel
import { AuthRequest } from '../middlewares/authMiddleware'; // Import AuthRequest

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = [
    validateRequest(registerSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;
        const confirmationLink = await this.authService.register(email, password);
        res.status(201).json({ message: 'Registration successful', confirmationLink });
      } catch (error) {
        next(error);
      }
    },
  ];

  confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      await this.authService.confirmEmail(token);
      res.status(200).json({ message: 'Email confirmed successfully' });
    } catch (error) {
      next(error);
    }
  };

  login = [
    validateRequest(loginSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;
        const token = await this.authService.login(email, password);
        res.cookie('jwt', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.status(200).json({ message: 'Login successful' });
      } catch (error) {
        next(error);
      }
    },
  ];

  logout = async (req: Request, res: Response) => {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logout successful' });
  };

  me = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await UserModel.findById(req.user?.id).select('-password');
      if (!user) {
        throw new AppError('User not found', 404);
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}