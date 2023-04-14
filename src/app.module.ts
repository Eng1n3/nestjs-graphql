/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ProjectModule } from './project/project.module';
import { DocumentModule } from './document/document.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from './common/functions/env.function';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';
import { dataSourceOptions } from './database/data-source';
import { PubsubModule } from './pubsub/pubsub.module';
import { PriorityModule } from './priority/priority.module';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvPath({ folder: './config' }),
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    GraphqlModule,
    UsersModule,
    ProjectModule,
    DocumentModule,
    AuthModule,
    PubsubModule,
    PriorityModule,
  ],
  controllers: [],
  providers: [{ provide: APP_INTERCEPTOR, useClass: SentryInterceptor }],
})
export class AppModule {}
