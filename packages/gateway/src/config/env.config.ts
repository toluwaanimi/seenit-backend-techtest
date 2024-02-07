import * as env from 'env-var';
import { config } from 'dotenv';

config();

/**
 * Environment variables configuration for the gateway service
 * @description
 * - NODE_ENV: Node environment
 * - PORT: Port number
 * - JWT_SECRET: JWT secret
 * - USER_SERVICE_URL: User service URL
 * - PROJECT_SERVICE_URL: Project service URL
 */
export const NODE_ENV = env.get('NODE_ENV').asString();

export const PORT = env.get('GATEWAY_PORT').asInt();
export const JWT_SECRET = env.get('JWT_SECRET').asString();

export const USER_SERVICE_URL = env.get('USER_SERVICE_URL').asString();

export const PROJECT_SERVICE_URL = env.get('PROJECT_SERVICE_URL').asString();
