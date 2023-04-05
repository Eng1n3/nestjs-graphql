import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ProjectModule } from './project/project.module';
import { DocumentModule } from './document/document.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from './common/functions/env.function';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';
import { dataSourceOptions } from './database/data-source';
import GraphQLJSON from 'graphql-type-json';
import * as depthLimit from 'graphql-depth-limit';
import { ComplexityPlugin } from './common/plugins/complexity.plugin';
import { PubsubModule } from './pubsub/pubsub.module';
import { Context } from 'graphql-ws';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvPath({ folder: './config' }),
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      // installSubscriptionHandlers: true,
      useFactory: (configService: ConfigService) => ({
        subscriptions: {
          'graphql-ws': {
            onConnect: (context: Context<any>) => {
              const { connectionParams, extra } = context;
              // user validation will remain the same as in the example above
              // when using with graphql-ws, additional context value should be stored in the extra field
              // extra.user = { user: {} };
              console.log('Redis connect');
            },
          },
          'subscriptions-transport-ws': true,
        },
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: true,
        context: ({ req }) => ({ req }),
        csrfPrevention: false,
        validationRules: [depthLimit(3)],
        resolvers: { JSON: GraphQLJSON },
        introspection: true,
        cache: 'bounded',
      }),
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
    PubsubModule,
  ],
  controllers: [],
  providers: [
    ComplexityPlugin,
    { provide: APP_INTERCEPTOR, useClass: SentryInterceptor },
  ],
})
export class AppModule {}
