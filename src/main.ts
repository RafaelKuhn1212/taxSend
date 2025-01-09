import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Bree from 'bree';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}
bootstrap();
