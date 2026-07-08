import { NestFactory } from '@nestjs/core';
import { FleetModule } from './fleet.module';

async function bootstrap() {
  const app = await NestFactory.create(FleetModule);
  await app.listen(3003);
  console.log(`Fleet Service is running on: ${await app.getUrl()}`);
}
bootstrap();
