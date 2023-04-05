import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class ChangePasswordStrategy extends PassportStrategy(
  Strategy,
  'changePassword',
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_FORGOT_PASSWORD_PRIVATE_KEY'),
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.authService.findUser(payload.email);
      if (!user) throw new UnauthorizedException();
      return {
        idUser: payload.idUser,
        email: payload.email,
        roles: payload.role,
      };
    } catch (error) {
      throw error;
    }
  }
}
