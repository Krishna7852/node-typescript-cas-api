import dotenv from 'dotenv';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

// Configuration interface
interface Config {
  port: number;
  mongoUri: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  nodeEnv: string;
}

// Validate environment variables
const validateEnv = (): Config => {
  const requiredEnvVars = [
    'PORT',
    'MONGODB_URI',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'ACCESS_TOKEN_EXPIRES_IN',
    'REFRESH_TOKEN_EXPIRES_IN',
    'NODE_ENV'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  return {
    port: parseInt(process.env.PORT || '3000', 10),
    mongoUri: process.env.MONGODB_URI!,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN!,
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN!,
    nodeEnv: process.env.NODE_ENV!
  };
};

let config: Config;

try {
  config = validateEnv();
  logger.info('Environment variables loaded successfully');
} catch (error) {
  logger.error('Error loading environment variables:', error);
  process.exit(1);
}

export default config;
