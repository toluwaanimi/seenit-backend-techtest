import { IProjectRepository } from '../../domain/repositories';
import {
  PaginateProject,
  ProjectFilterInput,
} from '../../infrastructure/common/schemas/project.schema';

export class FindUserProjectsUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async findUserProjects(
    userId: string,
    filter: ProjectFilterInput,
  ): Promise<PaginateProject> {
    return await this.projectRepository.paginate(
      {
        page: filter.page || 1,
        limit: filter.limit || 10,
      },
      {
        where: {
          createdBy: userId,
        },
      },
    );
  }
}
