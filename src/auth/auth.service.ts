/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as postmark from 'postmark';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { emailTemplate } from './templates/email.template';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private getSalt = bcrypt.genSaltSync();

  async updatePassword(idUser: string, password: string) {
    try {
      const hashPassword = await bcrypt.hash(password, this.getSalt);
      await this.usersService.updatePassword(idUser, hashPassword);
    } catch (error) {
      throw error;
    }
  }

  async sendEmail(user: User) {
    try {
      const payload = {
        idUser: user.idUser,
        email: user.email,
        role: user.role,
      };
      const serverToken = this.configService.get<string>('POSTMARKAPP_TOKEN');
      const client = new postmark.ServerClient(serverToken);
      const secret = this.configService.get<string>(
        'JWT_FORGOT_PASSWORD_PRIVATE_KEY',
      );
      const expiresIn = this.configService.get<string>(
        'JWT_FORGOT_PASSWORD_EXPIRES_IN',
      );
      const tokenForgotPassword: string = await this.jwtService.sign(payload, {
        secret,
        expiresIn,
      });

      client.sendEmail({
        From: this.configService.get<string>('POSTMARKAPP_FROM'),
        To: user.email,
        Subject: 'Forgot password',
        // InlineCss: true,
        // TextBody: 'Coba kirim',
        HtmlBody: emailTemplate(tokenForgotPassword),
      });
    } catch (error) {
      throw error;
    }
  }

  async login(user: User): Promise<string> {
    const payload = {
      idUser: user.idUser,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    return token;
  }

  async findUser(email: string): Promise<User> {
    try {
      const user = await this.usersService.findOne(email);
      if (user) return user;
      return null;
    } catch (error) {
      throw error;
    }
  }

  async validateAdmin(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findOne(email);
      if (user && user.role === 'admin') {
        const comparePassword = await bcrypt.compare(password, user.password);
        if (comparePassword) {
          return user;
        }
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findOne(email);
      if (user && user.role === 'user') {
        const comparePassword = await bcrypt.compare(password, user.password);
        if (comparePassword) {
          return user;
        }
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}
