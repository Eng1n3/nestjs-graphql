import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PubSub } from 'graphql-subscriptions';
// import { RedisPubSub } from 'graphql-redis-subscriptions';

export const PUB_SUB = 'PUB_SUB';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PUB_SUB,
      useFactory: (configService: ConfigService) => new PubSub(),

      // Digunakan untuk redis
      // new RedisPubSub({
      //   connection: {
      //     host: configService.get<string>('REDIS_HOST'),
      //     port: configService.get<number>('REDIS_PORT'),
      //   },
      // }),
      inject: [ConfigService],
    },
  ],
  exports: [PUB_SUB],
})
export class PubsubModule {}
