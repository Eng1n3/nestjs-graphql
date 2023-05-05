/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ProjectModule } from './project/project.module';
import { DocumentModule } from './document/document.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from './common/functions/env.function';
import { dataSourceOptions } from './database/data-source';
import { PUB_SUB, PubsubModule } from './pubsub/pubsub.module';
import { PriorityModule } from './priority/priority.module';
import { GraphqlModule } from './graphql/graphql.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

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
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          max: +configService.get<number>('CACHE_MAXIMUM'),
          ttl: +configService.get<number>('CACHE_TTL_IN_SECOND'),
          // store: (await redisStore({
          //   ttl: configService.get<number>('REDIS_TTL_IN_SECOND'),
          //   url: `redis://${
          //     configService.get<string>('REDIS_PASSWORD')
          //       ? configService.get<string>('REDIS_PASSWORD') + '@'
          //       : ''
          //   }${configService.get<string>(
          //     'REDIS_HOST',
          //   )}:${configService.get<string>(
          //     'REDIS_PORT',
          //   )}/${configService.get<number>('REDIS_DATABASE')}`,
          // })) as unknown as CacheStore,
        };
      },
      inject: [ConfigService],
    }),
    GraphqlModule,
    UsersModule,
    ProjectModule,
    DocumentModule,
    AuthModule,
    PubsubModule,
    PriorityModule,
  ],
})
export class AppModule {}
