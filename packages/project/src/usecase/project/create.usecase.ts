import { IProjectRepository } from '../../domain/repositories';
import { ICreateProject } from '../../domain/adapters/project.interface';
import { Project } from '../../infrastructure/common/schemas/project.schema';

export class CreateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async create(input: ICreateProject): Promise<Project> {
    const project = await this.projectRepository.getProjectByName(input.name);
    if (project) {
      throw new Error('project already exists');
    }
    return await this.projectRepository.save({
      name: input.name,
      description: input.description,
      createdBy: input.createdBy,
    });
  }
}
