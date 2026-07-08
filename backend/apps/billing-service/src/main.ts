import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module';

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  await app.listen(3002);
  console.log(`Billing Service is running on: ${await app.getUrl()}`);
}
bootstrap();
