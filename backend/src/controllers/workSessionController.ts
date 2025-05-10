import { Request, Response, NextFunction } from 'express';
import { WorkSessionService } from '../services/workSessionService';
import { AuthRequest } from '../middlewares/authMiddleware';
import { AppError } from '../utils/error';

export class WorkSessionController {
  private workSessionService: WorkSessionService;

  constructor() {
    this.workSessionService = new WorkSessionService();
  }

  startSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { projectId, description } = req.body;
      if (!projectId) {
        throw new AppError('Project ID is required', 400);
      }
      const session = await this.workSessionService.startSession(
        req.user!.id,
        projectId,
        description
      );
      res.status(201).json(session);
    } catch (error) {
      next(error);
    }
  };

  stopSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.workSessionService.stopSession(req.user!.id);
      res.status(200).json({ message: 'Work session stopped' });
    } catch (error) {
      next(error);
    }
  };

  getWorkSessions = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const sessions = await this.workSessionService.getUserWorkSessions(req.user!.id);
      res.status(200).json(sessions);
    } catch (error) {
      next(error);
    }
  };

  getUserWorkTimeByDay = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const workTime = await this.workSessionService.getUserWorkTimeByDay(req.user!.id);
      res.status(200).json(workTime);
    } catch (error) {
      next(error);
    }
  };

  getAllUsersWorkTimeByDay = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (req.user!.role !== 'admin') {
        throw new AppError('Admin access required', 403);
      }
      const userIdsRaw = req.query.userIds;
      let userIds: string[] | undefined;

      if (userIdsRaw) {
        userIds = Array.isArray(userIdsRaw)
          ? userIdsRaw.filter((id): id is string => typeof id === 'string')
          : typeof userIdsRaw === 'string'
          ? [userIdsRaw]
          : [];
      } else {
        userIds = undefined;
      }

      const workTime = await this.workSessionService.getAllUsersWorkTimeByDay(userIds);
      res.status(200).json(workTime);
    } catch (error) {
      next(error);
    }
  };

  getAllActiveSessions = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user!.role !== 'admin') {
        throw new AppError('Admin access required', 403);
      }
      const activeSessions = await this.workSessionService.getAllActiveSessions();
      res.status(200).json(activeSessions);
    } catch (error) {
      next(error);
    }
  };

  getAllSessions = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user!.role !== 'admin') {
        throw new AppError('Admin access required', 403);
      }
      const sessions = await this.workSessionService.getAllSessions();
      res.status(200).json(sessions);
    } catch (error) {
      next(error);
    }
  };

  getTotalTimeByProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const totalTime = await this.workSessionService.getTotalTimeByProject();
      res.status(200).json(totalTime);
    } catch (error) {
      next(error);
    }
  };
}