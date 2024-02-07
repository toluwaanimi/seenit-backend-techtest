import { Module } from '@nestjs/common';
import { JwtModule as Jwt } from '@nestjs/jwt';
import { JwtTokenService } from './jwt.service';
import { envConfig } from '../../config/environment-config/environment.config';

@Module({
  imports: [
    Jwt.register({
      secret: envConfig.getJwtSecret(),
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [JwtTokenService],
  exports: [JwtTokenService],
})
export class JwtServiceModule {}
