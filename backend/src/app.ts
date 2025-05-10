import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './utils/db';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import workSessionRoutes from './routes/workSessionRoutes';
import errorMiddleware from './middlewares/errorMiddleware';
import { logger } from './utils/logger';
import YAML from 'yamljs';
import path from 'path';
import userRoutes from './routes/userRoutes';
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger/openapi.yaml'));

export const createApp = async (): Promise<Express> => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());

  // Connect to MongoDB
  await connectDB();

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/work', workSessionRoutes);
  app.use('/api/users', userRoutes);
  // Swagger documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Error handling
  app.use(errorMiddleware);

  return app;
};
