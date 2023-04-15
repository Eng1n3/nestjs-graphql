import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.use(
    graphqlUploadExpress({
      maxFileSize: configService.get<number>('MAX_FILE_SIZE_IN_BYTE'),
      maxFiles: configService.get<number>('MAX_FILES_IN_NUMBER'),
    }),
  );
  app.enableCors({
    credentials: true,
    origin: [
      configService.get<string>('FRONTEND_DOMAIN'),
      configService.get<string>('DOMAIN'),
      'http://localhost:3000',
      'http://localhost:19004',
    ],
  });
  // Sentry.init({
  //   dsn: configService.get('SENTRY_DSN'),
  //   tracesSampleRate: 1.0,
  // });
  app.useGlobalInterceptors(new SentryInterceptor());
  const port = configService.get<number>('PORT');
  await app.listen(port);
}
bootstrap();
