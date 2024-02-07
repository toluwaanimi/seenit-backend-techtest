import { LoginUseCase } from '../login.usecase';

const mockData = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\n',
  user: {
    id: '2cfdbefd-3ee2-4b23-99ae-ee65b1e3e0b8',
    email: 'admin@seenit.com',
    password: 'password',
    hashedPassword: 'password',
  },
};

const jwtServiceMock = {
  generateJwtToken: jest.fn().mockReturnValue(mockData.token),
};

/**
 * Mocking the user repository
 * getUserByEmail will return the user if the email is valid
 */
const userRepositoryMock = {
  getUserByEmail: jest.fn().mockImplementation((email: string) => {
    if (email === mockData.user.email) {
      return {
        id: mockData.user.id,
        email: mockData.user.email,
        password: mockData.user.password,
      };
    }
    return null;
  }),
};

const bcryptServiceMock = {
  compare: jest
    .fn()
    .mockImplementation((password: string, hashedPassword: string) => {
      return (
        password === mockData.user.password &&
        hashedPassword === mockData.user.hashedPassword
      );
    }),
};

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    loginUseCase = new LoginUseCase(
      jwtServiceMock as any,
      userRepositoryMock as any,
      bcryptServiceMock as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate JWT token for valid credentials', async () => {
    const authToken = await loginUseCase.loginWithPassword(
      mockData.user.email,
      mockData.user.password,
    );
    expect(authToken.token).toBe(mockData.token);
    expect(userRepositoryMock.getUserByEmail).toHaveBeenCalledWith(
      mockData.user.email,
    );
    expect(bcryptServiceMock.compare).toHaveBeenCalledWith(
      mockData.user.password,
      mockData.user.hashedPassword,
    );
    expect(jwtServiceMock.generateJwtToken).toHaveBeenCalledWith({
      id: mockData.user.id,
    });
  });

  it('should throw error for invalid email', async () => {
    await expect(
      loginUseCase.loginWithPassword(
        'random@gmail.com',
        mockData.user.password,
      ),
    ).rejects.toThrow('invalid credentials');
  });

  it('should throw error for invalid password', async () => {
    await expect(
      loginUseCase.loginWithPassword(mockData.user.email, 'wrongPassword'),
    ).rejects.toThrow('invalid credentials');
  });
});
