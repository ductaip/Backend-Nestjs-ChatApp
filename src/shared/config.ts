import z from 'zod';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config({
  path: '.env',
});
// check that exist env file
if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Không tìm thấy file .env');
  process.exit(1);
}

const configSchema = z.object({
  DATABASE_URL: z.string(),
  MONGO_URI: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  AGORA_APP_ID: z.string(),
  AGORA_APP_CERTIFICATE: z.string(),
  PORT: z.string(),
  SECRET_API_KEY: z.string(),
  FIRE_BASE_KEY: z.string(),
});

const configServer = configSchema.safeParse(process.env);
// console.log('check', process.env)

if (!configServer.success) {
  console.log('Các giá trị khai báo trong file .env không hợp lệ');
  console.error(configServer.error);
  process.exit(1);
}

const envConfig = configServer.data;

export default envConfig;
