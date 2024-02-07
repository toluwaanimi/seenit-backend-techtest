import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IJwtService,
  IJwtServicePayload,
} from '../../../domain/adapters/jwt.interface';
import { envConfig } from '../../config/environment-config/environment.config';

@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async verifyJwtToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token);
  }

  generateJwtToken(payload: IJwtServicePayload): string {
    return this.jwtService.sign(payload, {
      secret: envConfig.getJwtSecret() || 'SECRET',
      expiresIn: envConfig.getJwtExpiresIn() || '1d',
    });
  }
}
