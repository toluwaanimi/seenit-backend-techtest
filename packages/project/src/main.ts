import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './infrastructure/config/environment-config/environment.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(envConfig.getPort() || 3002);
}
bootstrap().then();
