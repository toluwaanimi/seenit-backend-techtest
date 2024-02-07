import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './infrastructure/config/environment-config/environment.config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.enableCors();
  await app.listen(envConfig.getPort() || 3000);
}

bootstrap().then();
