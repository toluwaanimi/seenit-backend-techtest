import { GeneralUseCaseProxyModule } from '../usecase-proxy/general-usecase-proxy.module';
import { Module } from '@nestjs/common';
import { AuthResolver } from './auth/auth.resolvers';
import { AccountResolver } from './account/account.resolvers';
import { AuthGuard } from '../common/guards/auth.guard';
import { JwtServiceModule } from '../services/jwt/jwt.module';

@Module({
  imports: [GeneralUseCaseProxyModule.register(), JwtServiceModule],
  providers: [AuthResolver, AccountResolver, AuthGuard],
})
export class ResolverModule {}
