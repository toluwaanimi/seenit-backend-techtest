import {
  HttpException,
  HttpStatus,
  Injectable,
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
  RequestMethod,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import {
  JWT_SECRET,
  PROJECT_SERVICE_URL,
  USER_SERVICE_URL,
} from './config/env.config';
const basicAuth = require('express-basic-auth');
import { Request, Response, NextFunction } from 'express';
import { authorizedGraphqlUser } from './common/constants';

/**
 * Extracts token from authorization header
 * @param authorizationHeader
 * @returns token
 */
const extractTokenFromAuthorizationHeader = (
  authorizationHeader: string,
): string => {
  const tokenRegex = /^Bearer (.*)$/;
  const match = authorizationHeader.match(tokenRegex);
  if (!match || match.length < 2) {
    throw new HttpException(
      { message: 'Invalid bearer token' },
      HttpStatus.UNAUTHORIZED,
    );
  }
  return match[1];
};

/**
 * Decodes authentication token
 * @param tokenString
 * @returns decoded token
 */
const decodeAuthToken = (tokenString: string): any => {
  try {
    return verify(tokenString, JWT_SECRET);
  } catch (error) {
    throw new HttpException(
      { message: 'Invalid authentication token' },
      HttpStatus.UNAUTHORIZED,
    );
  }
};

/**
 * Authenticates request
 * @param request
 * @returns user id and authorization header
 * @throws UnauthorizedException
 */
const authenticateRequest = ({
  req,
}): {
  userId: string;
  authorization: string;
} => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return {
        userId: '',
        authorization: '',
      };
    }
    const token = extractTokenFromAuthorizationHeader(authorizationHeader);
    const decodedToken: any = decodeAuthToken(token);
    return {
      userId: decodedToken.id,
      authorization: authorizationHeader,
    };
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    } else {
      throw new UnauthorizedException(
        'User unauthorized with invalid authorization headers',
      );
    }
  }
};

/**
 * Gateway Module
 * @description
 * - Manages the gateway service responsibilities
 * - Routes requests to relevant services
 * - Handles authentication and authorization
 * - Manages request headers, context, body, and query
 * - Implements comprehensive request handling mechanisms
 */
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      server: {
        context: authenticateRequest,
      },
      driver: ApolloGatewayDriver,
      gateway: {
        buildService: ({ name, url }) => {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }: any) {
              request.http.headers.set('userId', context.userId);
              if (!context.authorization) {
                const defaultUsername = 'admin';
                const defaultPassword = 'admin';
                const credentials = Buffer.from(
                  `${defaultUsername}:${defaultPassword}`,
                ).toString('base64');
                request.http.headers.set(
                  'Authorization',
                  `Basic ${credentials}`,
                );
              } else {
                request.http.headers.set(
                  'authorization',
                  context.authorization,
                );
              }
            },
          });
        },
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'User',
              url: USER_SERVICE_URL || 'http://localhost:3000/graphql',
            },
            {
              name: 'Project',
              url: PROJECT_SERVICE_URL || 'http://localhost:3002/graphql',
            },
          ],
        }),
      },
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/graphql', method: RequestMethod.ALL });
  }
}

@Injectable()
/**
 * AuthMiddleware
 * @implements {NestMiddleware}
 * @class
 * @description This auth middleware is used to authorize the user for the graphql endpoint
 */
export class AuthMiddleware implements NestMiddleware {
  private isExecuted = false;

  use(req: Request, res: Response, next: NextFunction) {
    if (this.isExecuted) {
      return next();
    }
    if (req.headers.authorization) {
      this.isExecuted = true;
    }

    const options = {
      challenge: true,
      users: authorizedGraphqlUser,
    };
    const authMiddleware = basicAuth(options);
    authMiddleware(req, res, (err?: any) => {
      if (err) {
        this.isExecuted = false;
      }
      if (req.headers.authorization) {
        this.isExecuted = true;
        next();
      }
    });
  }
}
