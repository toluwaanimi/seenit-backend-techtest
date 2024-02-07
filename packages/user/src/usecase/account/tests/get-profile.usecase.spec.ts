import { GetProfileUseCase } from '../get-profile.usecase';

const mockData = {
  user: {
    id: '2cfdbefd-3ee2-4b23-99ae-ee65b1e3e0b8',
    email: 'admin@seenit.com',
    firstName: 'John',
    lastName: 'Doe',
    avatarUrl: 'example.com/avatar',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

const userRepositoryMock = {
  findOne: jest.fn().mockImplementation((query) => {
    if (query.where.id === mockData.user.id) {
      return mockData.user;
    }
    return null;
  }),
};

describe('GetProfileUseCase', () => {
  let getProfileUseCase: GetProfileUseCase;

  beforeEach(() => {
    getProfileUseCase = new GetProfileUseCase(userRepositoryMock as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user profile if user exists', async () => {
    const userId = mockData.user.id;
    const userProfile = await getProfileUseCase.getProfile(userId);
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: {
        id: userId,
      },
    });
    expect(userProfile).toEqual({
      id: mockData.user.id,
      email: mockData.user.email,
      firstName: mockData.user.firstName,
      lastName: mockData.user.lastName,
      avatarUrl: mockData.user.avatarUrl,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should throw error if user does not exist', async () => {
    const userId = '1cfdbefd-3ee2-4b23-99ae-ee65b1e3e0b8';
    await expect(getProfileUseCase.getProfile(userId)).rejects.toThrowError(
      'user not found',
    );
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: {
        id: userId,
      },
    });
  });
});
