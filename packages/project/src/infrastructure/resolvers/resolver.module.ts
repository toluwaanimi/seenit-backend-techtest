import { GeneralUseCaseProxyModule } from '../usecase-proxy/general-usecase-proxy.module';
import { Module } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { JwtServiceModule } from '../services/jwt/jwt.module';
import { ProjectResolver } from './project/project.resolvers';

@Module({
  imports: [GeneralUseCaseProxyModule.register(), JwtServiceModule],
  providers: [AuthGuard, ProjectResolver],
})
export class ResolverModule {}
