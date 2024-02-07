import { IBcryptService, IJwtService } from '../../domain/adapters';
import { IUserRepository } from '../../domain/repositories';
import { BadRequestException } from '@nestjs/common';
import { IAuthToken } from '../../domain/usecase/auth.interface';
import { RegisterUserInput } from '../../infrastructure/common/schemas/auth.schema';

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService,
    private readonly bcryptService: IBcryptService,
  ) {}

  /**
   * Register a new user and return a token for the use
   * @param input
   * @returns token
   * @throws BadRequestException
   * @throws Error
   */
  async register(input: RegisterUserInput): Promise<IAuthToken> {
    const user = await this.userRepository.getUserByEmail(input.email);
    if (user) {
      throw new BadRequestException('user already exists');
    }
    const hashedPassword = await this.bcryptService.hash(input.password);
    const newUser = await this.userRepository.save({
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.surname,
      avatarUrl: input.avatarUrl,
    });
    const token = this.jwtService.generateJwtToken({
      id: newUser.id,
    });
    return { token };
  }
}
