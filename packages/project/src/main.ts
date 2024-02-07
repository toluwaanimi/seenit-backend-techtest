import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './infrastructure/config/environment-config/environment.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(envConfig.getPort() || 3002);
}
bootstrap().then();
