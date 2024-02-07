import { IJwtService, IBcryptService } from '../../domain/adapters';
import { IUserRepository } from '../../domain/repositories';
import { IAuthToken } from '../../domain/usecase/auth.interface';

export class LoginUseCase {
  constructor(
    private readonly jwtService: IJwtService,
    private readonly userRepository: IUserRepository,
    private readonly bcryptService: IBcryptService,
  ) {}

  /**
   * Login with email and password
   * @param email
   * @param password
   * @returns token
   * @throws Error
   */
  async loginWithPassword(
    email: string,
    password: string,
  ): Promise<IAuthToken> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error('invalid credentials');
    }
    if (!(await this.bcryptService.compare(password, user.password))) {
      throw new Error('invalid credentials');
    }
    const token = this.jwtService.generateJwtToken({ id: user.id });
    return { token };
  }
}
