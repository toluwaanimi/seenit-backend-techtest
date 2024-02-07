import { IUserRepository } from '../../domain/repositories';
import {
  UpdateUserInput,
  User,
} from '../../infrastructure/common/schemas/account.schema';

export class UpdateProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async updateProfile(userId: string, data: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error('user not found');
    }
    const updatedUser = await this.userRepository.update(user.id, data);
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      avatarUrl: updatedUser.avatarUrl,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
