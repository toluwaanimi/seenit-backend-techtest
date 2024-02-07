// Mock ProjectRepository interface
import { FindAllProjectsUseCase } from '../find-all-projects.usecase';
import { ProjectFilterInput } from '../../../infrastructure/common/schemas/project.schema';

const projectRepositoryMock = {
  paginate: jest.fn().mockResolvedValue({
    data: [],
    limit: 10,
    itemCount: 0,
    itemsPerPage: 10,
    currentPage: 1,
  }),
};

describe('FindAllProjectsUseCase', () => {
  let findAllProjectsUseCase: FindAllProjectsUseCase;

  beforeEach(() => {
    findAllProjectsUseCase = new FindAllProjectsUseCase(
      projectRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find all projects with pagination', async () => {
    const filter: ProjectFilterInput = {
      page: 1,
      limit: 10,
    };
    const paginatedProjects = await findAllProjectsUseCase.findAll(filter);
    expect(projectRepositoryMock.paginate).toHaveBeenCalledWith(
      { page: filter.page, limit: filter.limit },
      { where: {} },
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
