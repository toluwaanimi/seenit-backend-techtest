import { IUserRepository } from '../../domain/repositories';
import { User } from '../../infrastructure/common/schemas/account.schema';

export class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find({});
  }
}
