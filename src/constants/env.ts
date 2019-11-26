import { devServerConfig } from './serverConfig.dev';
import { prodServerConfig } from './serverConfig.prod';

export enum EnvType {
  Development = "Development",
  Production = "Production",
  Staging = "Staging"
}

export const APP_NAME = "App Boilerplate";
export const SUPPORT_EMAIL = "email@gmail.com";
export const ENV: string = EnvType.Development; // Select which environment to use here

export const serverConfig =
  ENV === EnvType.Development ? devServerConfig : prodServerConfig;
