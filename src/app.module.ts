import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { UsersModule } from './users/users.module';
import { ProjectModule } from './project/project.module';
import { DocumentModule } from './document/document.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from './common/functions/env.function';
import * as depthLimit from 'graphql-depth-limit';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';
import { dataSourceOptions } from 'db/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvPath({ folder: './config' }),
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      context: ({ req }) => ({ req }),
      csrfPrevention: false,
      validationRules: [depthLimit(5)],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UsersModule,
    ProjectModule,
    DocumentModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    AppResolver,
    { provide: APP_INTERCEPTOR, useClass: SentryInterceptor },
  ],
})
export class AppModule {}
