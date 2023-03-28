/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as postmark from 'postmark';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
      await this.usersService.updatePassword(idUser, password);
    } catch (error) {
      throw error;
    }
  }

  async sendEmail(user: User) {
    try {
      const payload = {
        idUser: user.idUser,
        username: user.username,
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
        From: 'dev@optimap.id',
        To: user.email,
        Subject: 'Forgot password',
        // TextBody: 'Coba kirim',
        TextBody: `Use this link to reset your password. The link is only valid for ${this.configService.get<string>(
          'JWT_FORGOT_PASSWORD_EXPIRES_IN',
        )}.

        ************
        Hi ${user.username},
        ************

        You recently requested to reset your password for your account. Use the TOKEN. This password reset is only valid for the next ${this.configService.get<string>(
          'JWT_FORGOT_PASSWORD_EXPIRES_IN',
        )} with header authorization and mutation { changePassword(password: string, repassword: string) }

        Reset your password ( ${this.configService.get<string>(
          'DOMAIN',
        )}/graphql ) and token (${tokenForgotPassword})

        Thanks`,
      });
    } catch (error) {
      throw error;
    }
  }

  async login(user: User): Promise<string> {
    const payload = {
      idUser: user.idUser,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    return token;
  }

  async findUser(usernameOrEmail: string): Promise<User> {
    try {
      const user = await this.usersService.findOne(usernameOrEmail);
      if (user) return user;
      return null;
    } catch (error) {
      throw error;
    }
  }

  async validateAdmin(
    usernameOrEmail: string,
    password: string,
  ): Promise<User> {
    try {
      const user = await this.usersService.findOne(usernameOrEmail);
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

  async validateUser(usernameOrEmail: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findOne(usernameOrEmail);
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
