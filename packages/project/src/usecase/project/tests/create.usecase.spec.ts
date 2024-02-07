import { CreateProjectUseCase } from '../create.usecase';

const mockProjectData = {
  project: {
    id: '1cfdbefd-3ee2-4b23-99ae-ee65b1e3e0b8',
    name: 'Project',
    description: 'Just another random project',
    createdBy: '2cfdbefd-3ee2-4b23-99ae-ee65b1e3e0bd',
  },
};

const projectRepositoryMock = {
  getProjectByName: jest.fn().mockImplementation((name) => {
    return name === 'Project name'
      ? {
          name: 'Project name',
        }
      : null;
  }),
  save: jest.fn().mockImplementation((project) => ({
    ...project,
    id: mockProjectData.project.id,
  })),
};

describe('CreateProjectUseCase', () => {
  let createProjectUseCase: CreateProjectUseCase;

  beforeEach(() => {
    createProjectUseCase = new CreateProjectUseCase(
      projectRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new project', async () => {
    const projectData = {
      name: mockProjectData.project.name,
      description: mockProjectData.project.description,
      createdBy: mockProjectData.project.createdBy,
    };
    const createdProject = await createProjectUseCase.create(projectData);
    expect(projectRepositoryMock.getProjectByName).toHaveBeenCalledWith(
      mockProjectData.project.name,
    );
    expect(projectRepositoryMock.save).toHaveBeenCalledWith(projectData);
    expect(createdProject).toEqual({
      ...projectData,
      id: mockProjectData.project.id,
    });
  });

  it('should throw BadRequestException if project already exists', async () => {
    const existingProjectData = {
      name: 'Project name',
      description: mockProjectData.project.description,
      createdBy: mockProjectData.project.createdBy,
    };
    await expect(
      createProjectUseCase.create(existingProjectData),
    ).rejects.toThrowError(Error);
    expect(projectRepositoryMock.getProjectByName).toHaveBeenCalledWith(
      'Project name',
    );
    expect(projectRepositoryMock.save).not.toHaveBeenCalled();
  });
});
