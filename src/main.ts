import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import envConfig from './shared/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(envConfig.PORT ?? 3000);
}
bootstrap();
