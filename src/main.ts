/* eslint-disable prettier/prettier */
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { AppModule } from './app.module';
// import * as Sentry from '@sentry/node';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';
import * as cookieParser from 'cookie-parser';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const customError = errors.map((err) => {
          if (Object.keys(err.constraints).length)
            return JSON.stringify(Object.values(err.constraints)).replace(
              /([\[\]\'\"])/g,
              '',
            );
        });
        return new BadRequestException(JSON.stringify(customError));
      },
    }),
  );
  app.use(cookieParser());
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
