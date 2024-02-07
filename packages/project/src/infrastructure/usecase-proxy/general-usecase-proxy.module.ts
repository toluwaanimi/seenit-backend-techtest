import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { JwtServiceModule } from '../services/jwt/jwt.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { LoggerService } from '../logger/logger.service';
import { UseCaseProxy } from './usecase-proxy';
import { ProjectRepository } from '../repositories/project.repository';
import { CreateProjectUseCase } from '../../usecase/project/create.usecase';
import { DeleteProjectUseCase } from '../../usecase/project/delete.usecase';
import { UpdateProjectUseCase } from '../../usecase/project/update.usecase';
import { FindOneProjectUseCase } from '../../usecase/project/find-one.usecase';
import { FindUserProjectsUseCase } from '../../usecase/project/find-user-projects.usecase';
import { FindAllProjectsUseCase } from '../../usecase/project/find-all-projects.usecase';

/**
 * Module to manage the creation and configuration of general use case proxies.
 * This module provides factory methods to instantiate and configure use case proxies for various functionalities.
 * It imports necessary modules and injects required dependencies for the use case proxies.
 * @module GeneralUseCaseProxyModule
 */
@Module({
  imports: [LoggerModule, JwtServiceModule, RepositoriesModule],
})
export class GeneralUseCaseProxyModule {
  /**
   * Unique identifiers for different types of use case proxies.
   * These identifiers are used for dependency injection and export.
   */
  static CREATE_USER_PROJECT_USE_CASES_PROXY =
    'CREATE_USER_PROJECT_USE_CASES_PROXY';
  static GET_ALL_USER_PROJECT_USE_CASES_PROXY =
    'GET_ALL_USER_PROJECT_USE_CASES_PROXY';
  static GET_USER_PROJECT_USE_CASES_PROXY = 'GET_USER_PROJECT_USE_CASES_PROXY';
  static UPDATE_USER_PROJECT_USE_CASES_PROXY =
    'UPDATE_USER_PROJECT_USE_CASES_PROXY';
  static DELETE_USER_PROJECT_USE_CASES_PROXY =
    'DELETE_USER_PROJECT_USE_CASES_PROXY';
  static GET_USER_PROJECT_BY_ID_USE_CASES_PROXY =
    'GET_USER_PROJECT_BY_ID_USE_CASES_PROXY';

  static register() {
    return {
      module: GeneralUseCaseProxyModule,
      providers: [
        {
          inject: [LoggerService, ProjectRepository],
          provide:
            GeneralUseCaseProxyModule.CREATE_USER_PROJECT_USE_CASES_PROXY,
          useFactory: (
            logger: LoggerService,
            projectRepository: ProjectRepository,
          ) => new UseCaseProxy(new CreateProjectUseCase(projectRepository)),
        },
        {
          inject: [LoggerService, ProjectRepository],
          provide:
            GeneralUseCaseProxyModule.DELETE_USER_PROJECT_USE_CASES_PROXY,
          useFactory: (
            logger: LoggerService,
            projectRepository: ProjectRepository,
          ) => new UseCaseProxy(new DeleteProjectUseCase(projectRepository)),
        },
        {
          inject: [LoggerService, ProjectRepository],
          provide:
            GeneralUseCaseProxyModule.GET_USER_PROJECT_BY_ID_USE_CASES_PROXY,
          useFactory: (
            logger: LoggerService,
            projectRepository: ProjectRepository,
          ) => new UseCaseProxy(new FindOneProjectUseCase(projectRepository)),
        },
        {
          inject: [LoggerService, ProjectRepository],
          provide: GeneralUseCaseProxyModule.GET_USER_PROJECT_USE_CASES_PROXY,
          useFactory: (
            logger: LoggerService,
            projectRepository: ProjectRepository,
          ) => new UseCaseProxy(new FindUserProjectsUseCase(projectRepository)),
        },
        {
          inject: [LoggerService, ProjectRepository],
          provide:
            GeneralUseCaseProxyModule.GET_ALL_USER_PROJECT_USE_CASES_PROXY,
          useFactory: (
            logger: LoggerService,
            projectRepository: ProjectRepository,
          ) => new UseCaseProxy(new FindAllProjectsUseCase(projectRepository)),
        },
        {
          inject: [LoggerService, ProjectRepository],
          provide:
            GeneralUseCaseProxyModule.UPDATE_USER_PROJECT_USE_CASES_PROXY,
          useFactory: (
            logger: LoggerService,
            projectRepository: ProjectRepository,
          ) => new UseCaseProxy(new UpdateProjectUseCase(projectRepository)),
        },
      ],
      /**
       * Exports the use case proxies to be used in other modules.
       */
      exports: [
        GeneralUseCaseProxyModule.CREATE_USER_PROJECT_USE_CASES_PROXY,
        GeneralUseCaseProxyModule.GET_ALL_USER_PROJECT_USE_CASES_PROXY,
        GeneralUseCaseProxyModule.GET_USER_PROJECT_USE_CASES_PROXY,
        GeneralUseCaseProxyModule.UPDATE_USER_PROJECT_USE_CASES_PROXY,
        GeneralUseCaseProxyModule.DELETE_USER_PROJECT_USE_CASES_PROXY,
        GeneralUseCaseProxyModule.GET_USER_PROJECT_BY_ID_USE_CASES_PROXY,
      ],
    };
  }
}
