import { IProjectRepository } from '../../domain/repositories';
import {
  Project,
  UpdateProjectInput,
} from '../../infrastructure/common/schemas/project.schema';

export class UpdateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async update(data: UpdateProjectInput): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: {
        id: data.id,
        createdBy: data.createdBy,
      },
    });
    if (!project) {
      throw new Error('project not found');
    }

    if (data.name) {
      const uniqueName = await this.projectRepository.getProjectByName(
        data.name,
      );
      if (uniqueName && uniqueName.id !== data.id) {
        throw new Error('project already exists');
      }
    }
    return await this.projectRepository.update(data.id, data);
  }
}
