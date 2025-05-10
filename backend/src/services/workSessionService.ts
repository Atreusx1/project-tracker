import { WorkSessionModel, IWorkSession } from '../models/workSessionModel';
import { AppError } from '../utils/error';
import mongoose, { PipelineStage } from 'mongoose';

export class WorkSessionService {
  async startSession(userId: string, projectId: string, description?: string): Promise<IWorkSession> {
    const activeSession = await WorkSessionModel.findOne({
      user: userId,
      endTime: null,
    });
    if (activeSession) {
      throw new AppError('An active work session already exists', 400);
    }

    const session = new WorkSessionModel({
      user: userId,
      project: projectId,
      startTime: new Date(),
      description,
    });
    await session.save();
    return session.populate('project');
  }

  async stopSession(userId: string): Promise<void> {
    const session = await WorkSessionModel.findOne({
      user: userId,
      endTime: null,
    });
    if (!session) {
      throw new AppError('No active work session found', 404);
    }

    session.endTime = new Date();
    await session.save();
  }

  async getUserWorkSessions(userId: string): Promise<IWorkSession[]> {
    return WorkSessionModel.find({ user: userId }).populate('project');
  }

  async getUserWorkTimeByDay(userId: string): Promise<{ date: string; totalHours: number }[]> {
    const pipeline: PipelineStage[] = [
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $project: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } },
          duration: {
            $cond: {
              if: { $eq: ['$endTime', null] },
              then: 0,
              else: {
                $divide: [{ $subtract: ['$endTime', '$startTime'] }, 1000 * 60 * 60],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: '$date',
          totalHours: { $sum: '$duration' },
        },
      },
      {
        $project: {
          date: '$_id',
          totalHours: 1,
          _id: 0,
        },
      },
      { $sort: { date: 1 } },
    ];

    const sessions = await WorkSessionModel.aggregate(pipeline);
    return sessions;
  }

  async getAllUsersWorkTimeByDay(
    userIds?: string[]
  ): Promise<{ date: string; totalHours: number; userId: string; userEmail: string }[]> {
    const match: any = {};
    if (userIds && userIds.length > 0) {
      match.user = { $in: userIds.map((id) => new mongoose.Types.ObjectId(id)) };
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData',
        },
      },
      { $unwind: '$userData' },
      {
        $project: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } },
          userId: '$user',
          userEmail: '$userData.email',
          duration: {
            $cond: {
              if: { $eq: ['$endTime', null] },
              then: 0,
              else: {
                $divide: [{ $subtract: ['$endTime', '$startTime'] }, 1000 * 60 * 60],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: { date: '$date', userId: '$userId', userEmail: '$userEmail' },
          totalHours: { $sum: '$duration' },
        },
      },
      {
        $project: {
          date: '$_id.date',
          userId: '$_id.userId',
          userEmail: '$_id.userEmail',
          totalHours: 1,
          _id: 0,
        },
      },
      { $sort: { date: 1, userEmail: 1 } },
    ];

    const sessions = await WorkSessionModel.aggregate(pipeline);
    return sessions;
  }

  async getAllActiveSessions(): Promise<IWorkSession[]> {
    const sessions = await WorkSessionModel.aggregate([
      { $match: { endTime: null } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'project',
        },
      },
      { $unwind: '$project' },
      {
        $project: {
          _id: 1,
          user: { email: '$user.email' },
          project: { name: '$project.name' },
          description: 1,
          startTime: 1,
          endTime: 1,
        },
      },
    ]);
    return sessions;
  }

  async getAllSessions(): Promise<IWorkSession[]> {
    const sessions = await WorkSessionModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'project',
        },
      },
      { $unwind: '$project' },
      {
        $project: {
          _id: 1,
          user: { email: '$user.email' },
          project: { name: '$project.name' },
          description: 1,
          startTime: 1,
          endTime: 1,
        },
      },
      { $sort: { startTime: -1 } },
    ]);
    return sessions;
  }

  async getTotalTimeByProject(): Promise<{ projectId: string; projectName: string; totalHours: number }[]> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          endTime: { $ne: null }, // Only include completed sessions
        },
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'project',
        },
      },
      { $unwind: '$project' },
      {
        $group: {
          _id: {
            projectId: '$project._id',
            projectName: '$project.name',
          },
          totalHours: {
            $sum: {
              $divide: [{ $subtract: ['$endTime', '$startTime'] }, 1000 * 60 * 60],
            },
          },
        },
      },
      {
        $project: {
          projectId: '$_id.projectId',
          projectName: '$_id.projectName',
          totalHours: 1,
          _id: 0,
        },
      },
      { $sort: { projectName: 1 } },
    ];

    const result = await WorkSessionModel.aggregate(pipeline);
    return result;
  }
}