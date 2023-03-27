import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload-ts';
// import { graphqlUploadExpress } from 'graphql-upload-minimal';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port);
}
bootstrap();
