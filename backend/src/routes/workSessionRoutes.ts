import { Router } from 'express';
import { WorkSessionController } from '../controllers/workSessionController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const workSessionController = new WorkSessionController();

router.post('/start', authMiddleware, workSessionController.startSession);
router.post('/stop', authMiddleware, workSessionController.stopSession);
router.get('/me', authMiddleware, workSessionController.getWorkSessions);
router.get('/time-by-day', authMiddleware, workSessionController.getUserWorkTimeByDay);
router.get(
  '/all-time-by-day',
  authMiddleware,
  workSessionController.getAllUsersWorkTimeByDay
);

export default router;