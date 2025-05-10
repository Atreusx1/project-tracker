import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';
import { logger } from '../utils/logger';

export default (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    logger.error(`${error.statusCode} - ${error.message}`);
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  logger.error('Unexpected error:', error);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};