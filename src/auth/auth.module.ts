import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { ChangePasswordStrategy } from './strategies/change-password.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalAdmintrategy } from './strategies/local-admin.strategy';
import { LocalUserStrategy } from './strategies/local-user.strategy';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
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
  providers: [
    ConfigService,
    AuthResolver,
    AuthService,
    LocalUserStrategy,
    LocalAdmintrategy,
    JwtStrategy,
    ChangePasswordStrategy,
  ],
})
export class AuthModule {}
