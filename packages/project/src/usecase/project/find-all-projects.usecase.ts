import { IProjectRepository } from '../../domain/repositories';
import {
  PaginateProject,
  ProjectFilterInput,
} from '../../infrastructure/common/schemas/project.schema';

export class FindAllProjectsUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async findAll(filter: ProjectFilterInput): Promise<PaginateProject> {
    return await this.projectRepository.paginate(
      {
        page: filter.page,
        limit: filter.limit,
      },
      {
        where: {},
      },
    );
  }
}
