import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalUserStrategy extends PassportStrategy(Strategy, 'localUser') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'usernameOrEmail', passwordField: 'password' });
  }

  async validate(usernameOrEmail: string, password: string): Promise<User> {
    try {
      const user = await this.authService.validateUser(
        usernameOrEmail,
        password,
      );
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
