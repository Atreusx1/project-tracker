import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/projectService';
import { validateRequest } from '../middlewares/validateRequest';
import { projectSchema } from '../utils/validators';
import { AuthRequest } from '../middlewares/authMiddleware';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  createProject = [
    validateRequest(projectSchema),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const project = await this.projectService.createProject({
          ...req.body,
          createdBy: req.user!.id,
        });
        res.status(201).json(project);
      } catch (error) {
        next(error);
      }
    }
  ];

  getProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, sort = 'createdAt' } = req.query;
      const projects = await this.projectService.getProjects({
        page: Number(page),
        limit: Number(limit),
        sort: sort as string,
      });
      res.status(200).json(projects);
    } catch (error) {
      next(error);
    }
  };
}
