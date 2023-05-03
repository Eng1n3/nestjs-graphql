import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwtRefresh',
) {
  private static extractJWT(req: Request): string | null {
    if (req.cookies && req.cookies['Refresh-Token']) {
      return req.cookies['Refresh-Token'];
    }
    return null;
  }
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRefreshStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_PRIVATE_KEY'),
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.authService.findUser(
        payload.email.toLowerCase() as string,
      );
      if (!user) throw new UnauthorizedException('User tidak ada!');
      return {
        idUser: payload.idUser,
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      throw error;
    }
  }
}
