import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { User } from '../../infrastructure/common/schemas/account.schema';

export class GetProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error('user not found');
    }
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
