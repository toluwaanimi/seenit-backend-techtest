import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtTokenService } from '../../services/jwt/jwt.service';

/**
 * Guard to check if the request is authorized
 * @implements CanActivate
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtTokenService) {}

  /**
   * Check if the request is authorized
   * @param context
   * @returns boolean  True if the request is authorized, false otherwise
   * @throws UnauthorizedException  If the request is not authorized
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    try {
      const authorizationHeader = req.headers.authorization;
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

  /**
   * Verify the token and return the decrypted token
   * @param token
   * @private
   */
  private async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyJwtToken(token);
    } catch (error) {
      throw new UnauthorizedException('Failed to verify token');
    }
  }
}
