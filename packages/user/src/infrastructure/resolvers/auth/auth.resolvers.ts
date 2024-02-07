import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { GeneralUseCaseProxyModule } from '../../usecase-proxy/general-usecase-proxy.module';
import { UseCaseProxy } from '../../usecase-proxy/usecase-proxy';
import { LoginUseCase } from '../../../usecase/auth/login.usecase';
import {
  LoginUserInput,
  RegisterUserInput,
  Token,
} from '../../common/schemas/auth.schema';
import { RegisterUseCase } from '../../../usecase/auth/register.usecase';

@Resolver(() => Token)
export class AuthResolver {
  constructor(
    @Inject(GeneralUseCaseProxyModule.LOGIN_USE_CASES_PROXY)
    private readonly loginUseCaseUseCaseProxy: UseCaseProxy<LoginUseCase>,
    @Inject(GeneralUseCaseProxyModule.REGISTER_USE_CASES_PROXY)
    private readonly registerUseCaseUseCaseProxy: UseCaseProxy<RegisterUseCase>,
  ) {}

  @Query(() => String)
  async pong() {
    return 'User Service is up and running!';
  }

  @Mutation(() => Token, { name: 'login' })
  async login(@Args('input') input: LoginUserInput) {
    return this.loginUseCaseUseCaseProxy
      .getInstance()
      .loginWithPassword(input.email, input.password);
  }

  @Mutation(() => Token, { name: 'register' })
  async register(@Args('input') input: RegisterUserInput) {
    return this.registerUseCaseUseCaseProxy.getInstance().register(input);
  }
}
