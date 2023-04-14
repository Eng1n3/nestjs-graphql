/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  Module,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as depthLimit from 'graphql-depth-limit';
import GraphQLJSON from 'graphql-type-json';
import { Context } from 'graphql-ws';
import { join } from 'path';
import { ComplexityPlugin } from 'src/common/plugins/complexity.plugin';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [
        ConfigModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            return {
              secret: configService.get('JWT_PRIVATE_KEY'),
              signOptions: {
                expiresIn: configService.get('JWT_EXPIRES_IN'),
              },
            };
          },
          inject: [ConfigService],
        }),
      ],
      useFactory: (configService: ConfigService, jwtService: JwtService) => ({
        subscriptions: {
          //   'graphql-ws': {
          //     onConnect: (context: Context<any>) => {
          //       const { connectionParams, extra } = context;
          //       // user validation will remain the same as in the example above
          //       // when using with graphql-ws, additional context value should be stored in the extra field
          //       console.log(connectionParams, extra, 41);
          //     },
          //   },
          'subscriptions-transport-ws': {
            onConnect: (connectionParams) => {
              try {
                const authToken =
                  connectionParams?.Authorization?.split(' ')[1];
                const user = jwtService.verify(authToken);
                if (user?.role === 'user')
                  throw new ForbiddenException('Forbidden resource');
                return { user };
              } catch (error) {
                if (error.message !== 'Forbidden resource')
                  throw new UnauthorizedException();
                throw error;
              }
            },
            onDisconnect: () => {
              console.log('Disconnect!');
            },
          },
        },
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: configService.get<boolean>('PLAYGROND'),
        context: ({ req, connection }) => ({ req }),
        csrfPrevention: false,
        validationRules: [depthLimit(3)],
        resolvers: { JSON: GraphQLJSON },
        introspection: true,
      }),
      inject: [ConfigService, JwtService],
    }),
  ],
  providers: [ComplexityPlugin],
})
export class GraphqlModule {}
