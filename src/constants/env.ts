import { devServerConfig } from './serverConfig.dev';
import { prodServerConfig } from './serverConfig.prod';

export const appName = 'App Boilerplate';
export const supportEmail = 'email@gmail.com';
export const env = 'dev'; // Select which environment to use here (dev | prod)

export const serverConfig = env === 'dev' ? devServerConfig : prodServerConfig;
