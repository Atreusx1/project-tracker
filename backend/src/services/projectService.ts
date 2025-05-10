import { ProjectModel } from '../models/projectModel';
import { AppError } from '../utils/error';

interface ProjectInput {
  name: string;
  description?: string;
  createdBy: string;
}

interface GetProjectsOptions {
  page: number;
  limit: number;
  sort: string;
}

export class ProjectService {
  async createProject(input: ProjectInput) {
    const project = await ProjectModel.create(input);
    return project;
  }

  async getProjects(options: GetProjectsOptions) {
    const { page, limit, sort } = options;
    const result = await (ProjectModel as any).paginate({}, {
      page,
      limit,
      sort: { [sort]: -1 },
      populate: 'createdBy',
    });
    return result;
  }
}
