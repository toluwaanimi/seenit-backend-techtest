import { IProjectRepository } from '../../domain/repositories';

export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async delete(id: string): Promise<string> {
    return await this.projectRepository.delete(id);
  }
}
