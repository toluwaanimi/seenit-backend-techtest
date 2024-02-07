import { UpdateProfileUseCase } from '../update-profile.usecase';
import { UpdateUserInput } from '../../../infrastructure/common/schemas/account.schema';

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
  update: {
    id: '2cfdbefd-3ee2-4b23-99ae-ee65b1e3e0b8',
    email: 'admin@seenit.com',
    firstName: 'Solape',
    lastName: 'Akinlaja',
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
    return null; // Return null if user is not found
  }),
  update: jest.fn().mockImplementation((data) => {
    return mockData.update;
  }),
};

describe('UpdateProfileUseCase', () => {
  let updateProfileUseCase: UpdateProfileUseCase;

  beforeEach(() => {
    updateProfileUseCase = new UpdateProfileUseCase(userRepositoryMock as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update user profile and return updated user', async () => {
    const userId = mockData.user.id;
    const updateData: UpdateUserInput = {
      firstName: mockData.update.firstName,
      surname: mockData.update.lastName,
      avatarUrl: mockData.update.avatarUrl,
    };
    const updatedUserProfile = await updateProfileUseCase.updateProfile(
      userId,
      updateData,
    );
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: {
        id: userId,
      },
    });
    expect(updatedUserProfile).toEqual({
      id: mockData.update.id,
      email: mockData.update.email,
      firstName: mockData.update.firstName,
      lastName: mockData.update.lastName,
      avatarUrl: mockData.update.avatarUrl,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should throw error if user does not exist', async () => {
    const userId = 'nonexistent_id';
    const updateData: UpdateUserInput = {
      firstName: mockData.update.firstName,
      surname: mockData.update.lastName,
      avatarUrl: mockData.update.avatarUrl,
    };
    await expect(
      updateProfileUseCase.updateProfile(userId, updateData),
    ).rejects.toThrowError('user not found');
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: {
        id: userId,
      },
    });
    expect(userRepositoryMock.update).not.toHaveBeenCalled();
  });
});
