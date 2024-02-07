/**
 * Interface for environment variables
 * @interface
 * @name IEnvironmentInterface
 * @function getPort - Get the port number
 * @function getEnvironment - Get the environment
 * @function getJwtSecret - Get the JWT secret
 * @function getDatabaseConnectionString - Get the database connection string
 * @function getDatabaseCluster - Get the database cluster
 * @function getDatabaseClusterPassword - Get the database cluster password
 * @function getDatabaseScope - Get the database scope
 * @function getJwtExpiresIn - Get the JWT expiration time
 */
export interface IEnvironmentInterface {
  getPort(): number;

  getEnvironment(): string;

  getJwtSecret(): string;

  getDatabaseConnectionString(): string;

  getDatabaseCluster(): string;

  getDatabaseClusterPassword(): string;

  getDatabaseScope(): string;

  getJwtExpiresIn(): string;
}
