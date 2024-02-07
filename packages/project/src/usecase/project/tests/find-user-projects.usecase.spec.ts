import { FindUserProjectsUseCase } from '../find-user-projects.usecase';

const projectRepositoryMock = {
  paginate: jest.fn().mockResolvedValue({
    data: [],
    limit: 10,
    itemCount: 0,
    itemsPerPage: 10,
    currentPage: 1,
  }),
};

describe('FindUserProjectsUseCase', () => {
  let findUserProjectsUseCase: FindUserProjectsUseCase;

  beforeEach(() => {
    findUserProjectsUseCase = new FindUserProjectsUseCase(
      projectRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find projects created by a user with pagination', async () => {
    const userId = '1cfdbefd-3ee2-4b23-99ae-ee65b1e3e0b8';
    const paginatedProjects = await findUserProjectsUseCase.findUserProjects(
      userId,
      { page: 1, limit: 50 },
    );
    expect(projectRepositoryMock.paginate).toHaveBeenCalledWith(
      { page: 1, limit: 50 },
      { where: { createdBy: userId } },
    );
    expect(paginatedProjects).toEqual({
      data: [],
      limit: 10,
      itemCount: 0,
      itemsPerPage: 10,
      currentPage: 1,
    });
  });
});
