import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import multiPart from '@fastify/multipart';
import { ValidationPipe } from '@nestjs/common';
// import { HttpExceptionFilter } from './common/filters';

const globalPrefix = 'api';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({}),
    { bufferLogs: true },
  );

  await app.register(multiPart);

  app.enableCors({ origin: '*', exposedHeaders: ['Content-Disposition'] });

  app.setGlobalPrefix(globalPrefix, { exclude: ['/docs/redoc'] });

  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();
