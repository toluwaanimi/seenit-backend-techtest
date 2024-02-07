import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { JwtServiceModule } from '../services/jwt/jwt.module';
import { BcryptModule } from '../services/bcrypt/bcrypt.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { LoggerService } from '../logger/logger.service';
import { JwtTokenService } from '../services/jwt/jwt.service';
import { UserRepository } from '../repositories/user.repository';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { UseCaseProxy } from './usecase-proxy';
import { LoginUseCase } from '../../usecase/auth/login.usecase';
import { RegisterUseCase } from '../../usecase/auth/register.usecase';
import { GetProfileUseCase } from '../../usecase/account/get-profile.usecase';
import { UpdateProfileUseCase } from '../../usecase/account/update-profile.usecase';

/**
 * Module to manage the creation and configuration of general use case proxies.
 * This module provides factory methods to instantiate and configure use case proxies for various functionalities.
 * It imports necessary modules and injects required dependencies for the use case proxies.
 * @module GeneralUseCaseProxyModule
 */
@Module({
  imports: [LoggerModule, JwtServiceModule, BcryptModule, RepositoriesModule],
})
export class GeneralUseCaseProxyModule {
  /**
   * Unique identifiers for different types of use case proxies.
   * These identifiers are used for dependency injection and export.
   */
  static LOGIN_USE_CASES_PROXY = 'LoginUseCasesProxy';
  static REGISTER_USE_CASES_PROXY = 'RegisterUseCasesProxy';
  static GET_USER_ACCOUNT_USE_CASES_PROXY = 'GetUserAccountUseCasesProxy';
  static UPDATE_USER_ACCOUNT_USE_CASES_PROXY = 'UpdateUserAccountUseCasesProxy';

  static register() {
    return {
      module: GeneralUseCaseProxyModule,
      providers: [
        {
          inject: [
            LoggerService,
            JwtTokenService,
            UserRepository,
            BcryptService,
          ],
          provide: GeneralUseCaseProxyModule.LOGIN_USE_CASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwtTokenService: JwtTokenService,
            userRepository: UserRepository,
            bcryptService: BcryptService,
          ) =>
            new UseCaseProxy(
              new LoginUseCase(jwtTokenService, userRepository, bcryptService),
            ),
        },
        {
          inject: [
            LoggerService,
            JwtTokenService,
            UserRepository,
            BcryptService,
          ],
          provide: GeneralUseCaseProxyModule.REGISTER_USE_CASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwtTokenService: JwtTokenService,
            userRepository: UserRepository,
            bcryptService: BcryptService,
          ) =>
            new UseCaseProxy(
              new RegisterUseCase(
                userRepository,
                jwtTokenService,
                bcryptService,
              ),
            ),
        },
        {
          inject: [LoggerService, UserRepository],
          provide: GeneralUseCaseProxyModule.GET_USER_ACCOUNT_USE_CASES_PROXY,
          useFactory: (logger: LoggerService, userRepository: UserRepository) =>
            new UseCaseProxy(new GetProfileUseCase(userRepository)),
        },
        {
          inject: [LoggerService, UserRepository],
          provide:
            GeneralUseCaseProxyModule.UPDATE_USER_ACCOUNT_USE_CASES_PROXY,
          useFactory: (logger: LoggerService, userRepository: UserRepository) =>
            new UseCaseProxy(new UpdateProfileUseCase(userRepository)),
        },
      ],
      exports: [
        GeneralUseCaseProxyModule.LOGIN_USE_CASES_PROXY,
        GeneralUseCaseProxyModule.REGISTER_USE_CASES_PROXY,
        GeneralUseCaseProxyModule.GET_USER_ACCOUNT_USE_CASES_PROXY,
        GeneralUseCaseProxyModule.UPDATE_USER_ACCOUNT_USE_CASES_PROXY,
      ],
    };
  }
}
