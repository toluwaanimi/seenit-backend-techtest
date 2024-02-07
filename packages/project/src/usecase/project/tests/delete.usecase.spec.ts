import { DeleteProjectUseCase } from '../delete.usecase';

const projectRepositoryMock = {
  delete: jest.fn().mockResolvedValue('1cfdbefd-3ee2-4b23-99ae-ee65b1e3e0b2'),
};

describe('DeleteProjectUseCase', () => {
  let deleteProjectUseCase: DeleteProjectUseCase;

  beforeEach(() => {
    deleteProjectUseCase = new DeleteProjectUseCase(
      projectRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a project', async () => {
    const projectId = '1cfdbefd-3ee2-4b23-99ae-ee65b1e3e0b8';
    const deletedProjectId = await deleteProjectUseCase.delete(projectId);
    expect(projectRepositoryMock.delete).toHaveBeenCalledWith(projectId);
    expect(deletedProjectId).toBe('1cfdbefd-3ee2-4b23-99ae-ee65b1e3e0b2');
  });
});
