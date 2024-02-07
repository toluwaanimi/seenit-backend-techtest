import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtTokenService } from '../../services/jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    try {
      const userId = req.headers?.userId;
      const authorizationHeader = req.headers?.authorization;

      if (!userId && !authorizationHeader) {
        throw new UnauthorizedException('Unauthorized request');
      }

      if (userId) {
        req.user = { id: userId };
        return true;
      }
      if (!authorizationHeader) {
        throw new UnauthorizedException('Authorization header is missing');
      }

      const [bearer, token] = authorizationHeader.split(' ');
      const isBearerToken = bearer && bearer.toLowerCase() === 'bearer';
      if (!isBearerToken || !token) {
        throw new UnauthorizedException('Invalid authorization header format');
      }

      const decryptedToken = await this.verifyToken(token);
      if (!decryptedToken) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      req.user = { id: decryptedToken.id };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized request');
    }
  }

  private async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyJwtToken(token);
    } catch (error) {
      throw new UnauthorizedException('Failed to verify token');
    }
  }
}
