import {
  Injectable,
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver } from '@nestjs/apollo';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { GeneralUseCaseProxyModule } from './infrastructure/usecase-proxy/general-usecase-proxy.module';
import { JwtServiceModule } from './infrastructure/services/jwt/jwt.module';
import { JwtModule } from '@nestjs/jwt';
import { envConfig } from './infrastructure/config/environment-config/environment.config';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { BcryptModule } from './infrastructure/services/bcrypt/bcrypt.module';
import { ResolverModule } from './infrastructure/resolvers/resolver.module';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
const basicAuth = require('express-basic-auth');
import { Request, Response, NextFunction } from 'express';
import { authorizedGraphqlUser } from './infrastructure/common/constants';

@Module({
  imports: [
    JwtModule.register({
      secret: envConfig.getJwtSecret(),
    }),
    LoggerModule,
    BcryptModule,
    JwtServiceModule,
    ResolverModule,
    GeneralUseCaseProxyModule.register(),
    GraphQLModule.forRoot({
      driver: ApolloFederationDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ApolloServerPluginInlineTrace()],
      context: ({ req }: any) => ({ req }),
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message:
            // @ts-ignore
            error?.extensions?.exception?.response?.message || error?.message,
        };
        return graphQLFormattedError;
      },

      definitions: {
        path: join(process.cwd(), 'src/graphql.classes.ts'),
        outputAs: 'class',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
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
