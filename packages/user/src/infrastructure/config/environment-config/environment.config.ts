import * as env from 'env-var';
import { config } from 'dotenv';
import { IEnvironmentInterface } from '../../../domain/config';

config();

/**
 * Environment configuration
 * @implements {IEnvironmentInterface}
 * @name EnvironmentConfig
 */
class EnvironmentConfig implements IEnvironmentInterface {
  getPort(): number {
    return env.get('USER_PORT').asInt() || 3000;
  }

  getEnvironment(): string {
    return env.get('NODE_ENV').asString();
  }

  getJwtSecret(): string {
    return env.get('JWT_SECRET').asString();
  }

  getJwtExpiresIn(): string {
    return env.get('JWT_EXPIRES_IN').asString();
  }

  getDatabaseConnectionString(): string {
    return env.get('DATABASE_CONNECTION_STRING').asString();
  }

  getDatabaseCluster(): string {
    return env.get('DATABASE_CLUSTER').asString();
  }

  getDatabaseClusterPassword(): string {
    return env.get('DATABASE_CLUSTER_PASSWORD').asString();
  }

  getDatabaseBucket(): string {
    return env.get('DATABASE_BUCKET').asString();
  }

  getDatabaseScope(): string {
    return env.get('DATABASE_SCOPE').asString();
  }
}

/**
 * Environment configuration
 * @name envConfig
 */
export const envConfig = new EnvironmentConfig();
