import {
  Resolver,
  Query,
  Mutation,
  ResolveField,
  Parent,
  ResolveReference,
  Args,
} from '@nestjs/graphql';
import { GeneralUseCaseProxyModule } from '../../usecase-proxy/general-usecase-proxy.module';
import { Inject, UseGuards } from '@nestjs/common';
import { UseCaseProxy } from '../../usecase-proxy/usecase-proxy';
import { CreateProjectUseCase } from '../../../usecase/project/create.usecase';
import {
  CreateProjectInput,
  PaginateProject,
  Project,
  ProjectFilterInput,
  UpdateProjectInput,
  User,
} from '../../common/schemas/project.schema';
import { DeleteProjectUseCase } from '../../../usecase/project/delete.usecase';
import { FindOneProjectUseCase } from '../../../usecase/project/find-one.usecase';
import { FindUserProjectsUseCase } from '../../../usecase/project/find-user-projects.usecase';
import { FindAllProjectsUseCase } from '../../../usecase/project/find-all-projects.usecase';
import { UpdateProjectUseCase } from '../../../usecase/project/update.usecase';
import {
  GetAuthUser,
  IAuthUser,
} from '../../common/decorators/get-user.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';

@Resolver(() => Project)
@UseGuards(AuthGuard)
export class ProjectResolver {
  constructor(
    @Inject(GeneralUseCaseProxyModule.CREATE_USER_PROJECT_USE_CASES_PROXY)
    private readonly createUserProjectUseCasesProxy: UseCaseProxy<CreateProjectUseCase>,
    @Inject(GeneralUseCaseProxyModule.DELETE_USER_PROJECT_USE_CASES_PROXY)
    private readonly deleteProjectUseCaseUseCaseProxy: UseCaseProxy<DeleteProjectUseCase>,
    @Inject(GeneralUseCaseProxyModule.GET_USER_PROJECT_BY_ID_USE_CASES_PROXY)
    private readonly findOneProjectUseCaseUseCaseProxy: UseCaseProxy<FindOneProjectUseCase>,
    @Inject(GeneralUseCaseProxyModule.GET_USER_PROJECT_USE_CASES_PROXY)
    private readonly findUserProjectsUseCaseUseCaseProxy: UseCaseProxy<FindUserProjectsUseCase>,
    @Inject(GeneralUseCaseProxyModule.GET_ALL_USER_PROJECT_USE_CASES_PROXY)
    private readonly findAllProjectsUseCaseUseCaseProxy: UseCaseProxy<FindAllProjectsUseCase>,
    @Inject(GeneralUseCaseProxyModule.UPDATE_USER_PROJECT_USE_CASES_PROXY)
    private readonly updateUserProjectUseCaseUseCaseProxy: UseCaseProxy<UpdateProjectUseCase>,
  ) {}

  @Query(() => String)
  async ping() {
    return 'Project service running';
  }

  @Mutation(() => Project, { name: 'project' })
  async createProject(
    @GetAuthUser() user: IAuthUser,
    @Args('input') input: CreateProjectInput,
  ) {
    return await this.createUserProjectUseCasesProxy.getInstance().create({
      ...input,
      createdBy: user.id,
    });
  }

  @Query(() => PaginateProject, { name: 'userProjects' })
  async getUserProjects(
    @GetAuthUser() user: IAuthUser,
    @Args('filter') filter: ProjectFilterInput,
  ) {
    return await this.findUserProjectsUseCaseUseCaseProxy
      .getInstance()
      .findUserProjects(user.id, filter);
  }

  @Query(() => PaginateProject, { name: 'projects' })
  async getAllProjects(
    @GetAuthUser() user: IAuthUser,
    @Args('filter') filter: ProjectFilterInput,
  ) {
    return await this.findAllProjectsUseCaseUseCaseProxy
      .getInstance()
      .findAll(filter);
  }

  @Mutation(() => Project)
  async updateProject(
    @GetAuthUser() user: IAuthUser,
    @Args('input') input: UpdateProjectInput,
  ) {
    return await this.updateUserProjectUseCaseUseCaseProxy
      .getInstance()
      .update({
        ...input,
        createdBy: user.id,
      });
  }

  @Mutation(() => String)
  async deleteProject(@Args('id') id: string) {
    return await this.deleteProjectUseCaseUseCaseProxy.getInstance().delete(id);
  }

  @Query(() => Project, { name: 'project' })
  async findOneProject(@GetAuthUser() user: IAuthUser, @Args('id') id: string) {
    return await this.findOneProjectUseCaseUseCaseProxy
      .getInstance()
      .findOne(id);
  }

  @ResolveField(() => User)
  user(@Parent() project: Project) {
    return { __typename: 'User', id: project.createdBy };
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    return await this.findOneProjectUseCaseUseCaseProxy
      .getInstance()
      .findOne(reference.id);
  }
}
