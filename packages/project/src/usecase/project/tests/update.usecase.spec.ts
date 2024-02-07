import { UpdateProjectUseCase } from '../update.usecase';
import { UpdateProjectInput } from '../../../infrastructure/common/schemas/project.schema';

const projectMockData = {
  project: {
    id: '1cfdbefd-3ee2-4b23-99ae-ee65b1e3e0b8',
    name: 'Existing Project',
    description: 'Existing project description',
    createdBy: '1cfdbefd-3ee2-4b23-99ae-ee65b1e3e0b2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  update: {
    id: '1cfdbefd-3ee2-4b23-99ae-ee65b1e3e0b8',
    name: 'Project Named',
    description: 'Existing project description',
    createdBy: '1cfdbefd-3ee2-4b23-99ae-ee65b1e3e0b2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

const projectRepositoryMock = {
  findOne: jest.fn().mockImplementation((query) => {
    if (
      query.where.id === projectMockData.project.id &&
      query.where.createdBy === projectMockData.project.createdBy
    ) {
      return projectMockData.project;
    }
    return null;
  }),
  getProjectByName: jest.fn().mockImplementation((name) => {
    if (name === 'Existing Project') {
      return { id: '1cfdbefd-3ee2-4b23-99ae-ee65b1e3e0b8' };
    }
    return null;
  }),
  update: jest.fn().mockImplementation((data) => ({
    id: data.id || projectMockData.update.id,
    name: data.name || projectMockData.update.name,
    description: data.description || projectMockData.update.description,
    createdBy: data.createdBy || projectMockData.update.createdBy,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
};

describe('UpdateProjectUseCase', () => {
  let updateProjectUseCase: UpdateProjectUseCase;

  beforeEach(() => {
    updateProjectUseCase = new UpdateProjectUseCase(
      projectRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a project', async () => {
    const updateData: UpdateProjectInput = {
      id: projectMockData.update.id,
      name: projectMockData.update.name,
      description: projectMockData.update.description,
      createdBy: projectMockData.update.createdBy,
    };
    const updatedProject = await updateProjectUseCase.update(updateData);
    expect(projectRepositoryMock.findOne).toHaveBeenCalledWith({
      where: {
        id: updateData.id,
        createdBy: updateData.createdBy,
      },
    });
    expect(projectRepositoryMock.getProjectByName).toHaveBeenCalledWith(
      updateData.name,
    );
    expect(projectRepositoryMock.update).toHaveBeenCalledWith(
      updateData.id,
      updateData,
    );
    expect(updatedProject).toEqual({
      id: projectMockData.update.id,
      name: projectMockData.update.name,
      description: projectMockData.update.description,
      createdBy: projectMockData.update.createdBy,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should throw error if project does not exist', async () => {
    const updateData: UpdateProjectInput = {
      id: 'nonexistent_id',
      name: projectMockData.update.name,
      description: projectMockData.update.description,
      createdBy: projectMockData.project.createdBy,
    };
    await expect(updateProjectUseCase.update(updateData)).rejects.toThrowError(
      'project not found',
    );
    expect(projectRepositoryMock.findOne).toHaveBeenCalledWith({
      where: {
        id: updateData.id,
        createdBy: updateData.createdBy,
      },
    });
    expect(projectRepositoryMock.getProjectByName).not.toHaveBeenCalled();
    expect(projectRepositoryMock.update).not.toHaveBeenCalled();
  });
});
