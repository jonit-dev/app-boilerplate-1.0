import { EnvType } from './server.constants';
import { devServerConfig } from './serverConfig.dev';
import { prodServerConfig } from './serverConfig.prod';
import { stagServerConfig } from './serverConfig.stag';

// This file is responsible which environment configuration to use

let serverConfig: any;
export const ENV: string = EnvType.Production; // Select which environment to use here

switch (ENV) {
  case EnvType.Development:
    serverConfig = devServerConfig;
    break;
  case EnvType.Production:
    serverConfig = prodServerConfig;
    break;
  case EnvType.Staging:
    serverConfig = stagServerConfig;
    break;
}

export { serverConfig };
