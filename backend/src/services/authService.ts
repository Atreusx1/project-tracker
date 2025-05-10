import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';
import { AppError } from '../utils/error';
import { sendEmail } from '../utils/email'; // Assuming you have an email utility

export class AuthService {
  async register(email: string, password: string): Promise<string> {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // Create user
    const user = new UserModel({ email, password, role: 'user', isEmailConfirmed: false });
    await user.save();

    // Generate confirmation token
    const token = jwt.sign(
      { id: user._id.toString(), type: 'email_confirmation' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Generate confirmation link
    const confirmationLink = `${process.env.FRONTEND_URL}/auth/confirm-email/${token}`;

    // Send email (implement your email utility)
    try {
      await sendEmail({
        to: email,
        subject: 'Confirm Your Email',
        text: `Please confirm your email by clicking this link: ${confirmationLink}`,
        html: `<p>Please confirm your email by clicking <a href="${confirmationLink}">here</a>.</p>`,
      });
    } catch (error) {
      // If email fails, delete user to prevent unconfirmed accounts
      await UserModel.deleteOne({ _id: user._id });
      throw new AppError('Failed to send confirmation email', 500);
    }

    return confirmationLink;
  }

  async confirmEmail(token: string): Promise<void> {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; type: string };
      if (decoded.type !== 'email_confirmation') {
        throw new AppError('Invalid token type', 400);
      }

      // Find user
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      if (user.isEmailConfirmed) {
        throw new AppError('Email already confirmed', 400);
      }

      // Update user
      user.isEmailConfirmed = true;
      await user.save();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid or expired token', 400);
      }
      throw error;
    }
  }

  async login(email: string, password: string): Promise<string> {
    const user = await UserModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }
    if (!user.isEmailConfirmed) {
      throw new AppError('Please confirm your email first', 401);
    }

    // Generate JWT for session
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );
    return token;
  }
}