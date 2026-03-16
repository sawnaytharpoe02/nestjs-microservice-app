import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  app.useLogger(app.get(Logger))
  const configService = app.get(ConfigService)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.getOrThrow('PORT')
    }
  }
  )

  await app.startAllMicroservices()
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
