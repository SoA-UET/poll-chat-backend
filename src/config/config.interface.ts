export interface Config {
  NODE_ENV: string;
  HOST: string;
  PORT: number;
  MONGODB_URI: string;
  SECRET_KEY: string;
  FRONTEND_URLS: string[];
}
