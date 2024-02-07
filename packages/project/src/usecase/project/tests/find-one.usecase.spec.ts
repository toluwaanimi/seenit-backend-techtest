import { FindOneProjectUseCase } from '../find-one.usecase';

const mockProjectData = {
  project: {
    id: '1cfdbefd-3ee2-4b23-99ae-ee65b1e3e0b8',
    name: 'Project',
    description: 'Existing project description',
    createdBy: '2cfdbefd-3ee2-4b23-99ae-ee65b1e3e0b8',
  },
};

const projectRepositoryMock = {
  findOne: jest.fn().mockImplementation((query) => {
    if (query.where.id === mockProjectData.project.id) {
      return {
        id: mockProjectData.project.id,
        name: mockProjectData.project.name,
        description: mockProjectData.project.description,
        createdBy: mockProjectData.project.createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return null;
  }),
};

describe('FindOneProjectUseCase', () => {
  let findOneProjectUseCase: FindOneProjectUseCase;

  beforeEach(() => {
    findOneProjectUseCase = new FindOneProjectUseCase(
      projectRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a project by ID', async () => {
    const projectId = mockProjectData.project.id;
    const foundProject = await findOneProjectUseCase.findOne(projectId);
    expect(projectRepositoryMock.findOne).toHaveBeenCalledWith({
      where: {
        id: projectId,
      },
    });
    expect(foundProject).toEqual({
      id: mockProjectData.project.id,
      name: mockProjectData.project.name,
      description: mockProjectData.project.description,
      createdBy: mockProjectData.project.createdBy,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should throw error if project does not exist', async () => {
    const nonExistentProjectId = 'nonexistent_id';
    await expect(
      findOneProjectUseCase.findOne(nonExistentProjectId),
    ).rejects.toThrowError('project not found');
    expect(projectRepositoryMock.findOne).toHaveBeenCalledWith({
      where: {
        id: nonExistentProjectId,
      },
    });
  });
});
