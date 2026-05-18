import 'dotenv/config';
import configuration from './configuration';
import { validateEnv } from './env.validation';

validateEnv(process.env);

const appConfig = configuration();

export const config = {
  nodeEnv: appConfig.nodeEnv,
  port: appConfig.port,
  database: appConfig.database,
  jwt: appConfig.jwt,
} as const;
