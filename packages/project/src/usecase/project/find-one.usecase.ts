import { IProjectRepository } from '../../domain/repositories';

export class FindOneProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async findOne(id: string): Promise<any> {
    const project = await this.projectRepository.findOne({
      where: {
        id,
      },
    });
    if (!project) {
      throw new Error('project not found');
    }
    return project;
  }
}
