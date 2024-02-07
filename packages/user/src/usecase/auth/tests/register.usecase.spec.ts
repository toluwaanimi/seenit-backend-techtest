import { BadRequestException } from '@nestjs/common';
import { RegisterUseCase } from '../register.usecase';

const mockData = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\n',
  user: {
    id: '2cfdbefd-3ee2-4b23-99ae-ee65b1e3e0b8',
    email: 'admin@seenit.com',
    password: 'password',
    hashedPassword: 'password',
    firstName: 'John',
    surname: 'Doe',
    avatarUrl: 'example.com/avatar',
  },
};

const userRepositoryMock = {
  getUserByEmail: jest.fn().mockReturnValue(null),
  save: jest.fn().mockImplementation((user) => ({
    ...user,
    id: mockData.user.id,
  })),
};

const jwtServiceMock = {
  generateJwtToken: jest.fn().mockReturnValue(mockData.token),
};

const bcryptServiceMock = {
  hash: jest.fn().mockReturnValue(mockData.user.hashedPassword),
};

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase;

  beforeEach(() => {
    registerUseCase = new RegisterUseCase(
      userRepositoryMock as any,
      jwtServiceMock as any,
      bcryptServiceMock as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user and generate JWT token', async () => {
    const registerInput = {
      email: mockData.user.email,
      password: mockData.user.password,
      firstName: mockData.user.firstName,
      surname: mockData.user.surname,
      avatarUrl: mockData.user.avatarUrl,
    };
    const authToken = await registerUseCase.register(registerInput);
    expect(authToken.token).toBe(mockData.token);
    expect(userRepositoryMock.getUserByEmail).toHaveBeenCalledWith(
      mockData.user.email,
    );
    expect(bcryptServiceMock.hash).toHaveBeenCalledWith(mockData.user.password);
    expect(userRepositoryMock.save).toHaveBeenCalledWith({
      email: mockData.user.email,
      password: mockData.user.password,
      firstName: mockData.user.firstName,
      lastName: mockData.user.surname,
      avatarUrl: mockData.user.avatarUrl,
    });
    expect(jwtServiceMock.generateJwtToken).toHaveBeenCalledWith({
      id: mockData.user.id,
    });
  });

  it('should throw BadRequestException if user already exists', async () => {
    userRepositoryMock.getUserByEmail.mockReturnValueOnce({});
    const registerInput = {
      email: mockData.user.email,
      password: mockData.user.password,
      firstName: mockData.user.firstName,
      surname: mockData.user.surname,
      avatarUrl: mockData.user.avatarUrl,
    };
    await expect(registerUseCase.register(registerInput)).rejects.toThrowError(
      BadRequestException,
    );
    expect(userRepositoryMock.getUserByEmail).toHaveBeenCalledWith(
      mockData.user.email,
    );
    expect(bcryptServiceMock.hash).not.toHaveBeenCalled();
    expect(userRepositoryMock.save).not.toHaveBeenCalled();
    expect(jwtServiceMock.generateJwtToken).not.toHaveBeenCalled();
  });
});
