import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();
const projectController = new ProjectController();

router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin'),
  projectController.createProject
);
router.get('/', authMiddleware, projectController.getProjects);

export default router;
