import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { GeneralUseCaseProxyModule } from '../../usecase-proxy/general-usecase-proxy.module';
import { UseCaseProxy } from '../../usecase-proxy/usecase-proxy';
import { GetProfileUseCase } from '../../../usecase/account/get-profile.usecase';
import { UpdateUserInput, User } from '../../common/schemas/account.schema';
import { UpdateProfileUseCase } from '../../../usecase/account/update-profile.usecase';
import { AuthGuard } from '../../common/guards/auth.guard';
import {
  GetAuthUser,
  IAuthUser,
} from '../../common/decorators/get-user.decorator';

@Resolver(() => User)
@UseGuards(AuthGuard)
export class AccountResolver {
  constructor(
    @Inject(GeneralUseCaseProxyModule.GET_USER_ACCOUNT_USE_CASES_PROXY)
    private readonly getProfileUseCaseUseCaseProxy: UseCaseProxy<GetProfileUseCase>,
    @Inject(GeneralUseCaseProxyModule.UPDATE_USER_ACCOUNT_USE_CASES_PROXY)
    private readonly updateProfileUseCaseUseCaseProxy: UseCaseProxy<UpdateProfileUseCase>,
  ) {}

  @Query(() => User, { name: 'profile' })
  async getProfile(@GetAuthUser() user: IAuthUser) {
    return this.getProfileUseCaseUseCaseProxy.getInstance().getProfile(user.id);
  }

  @Mutation(() => User, { name: 'profile' })
  async updateProfile(
    @GetAuthUser() user: IAuthUser,
    @Args('data') data: UpdateUserInput,
  ) {
    return this.updateProfileUseCaseUseCaseProxy
      .getInstance()
      .updateProfile(user.id, data);
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    return this.getProfileUseCaseUseCaseProxy
      .getInstance()
      .getProfile(reference.id);
  }

  @Query(() => User, { name: 'user' })
  user(@Args('id') id: string) {
    return this.getProfileUseCaseUseCaseProxy.getInstance().getProfile(id);
  }
}
