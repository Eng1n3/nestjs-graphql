/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { RegisterAdminInput, RegisterUserInput } from './dto/register.input';
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
        TextBody: 'Coba kirim',
        // TextBody: `Use this link to reset your password. The link is only valid for 24 hours.

        // [Product Name] ( https://example.com )

        // ************
        // Hi ${user.username},
        // ************

        // You recently requested to reset your password for your account. Use the TOKEN. This password reset is only valid for the next ${this.configService.get<string>(
        //   'JWT_FORGOT_PASSWORD_EXPIRES_IN',
        // )} with authorization and mutation { changePassword(password: string, repassword: string) }

        // Reset your password ( ${this.configService.get<string>(
        //   'DOMAIN',
        // )} ) and token (${tokenForgotPassword})

        // For security, this request was received from a {{operating_system}} device using {{browser_name}}. If you did not request a password reset, please ignore this email or contact support ( {{ support_url }} ) if you have questions.

        // Thanks,
        // The [Product Name] team

        // [Company Name, LLC]`,
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

  async createUser(registerUserInput: RegisterUserInput): Promise<void | any> {
    try {
      const hashPassword = await bcrypt.hash(
        registerUserInput.password,
        this.getSalt,
      );
      await this.usersService.createUser({
        ...registerUserInput,
        password: hashPassword,
      });
    } catch (error) {
      if (
        error.message.includes('duplicate key value') &&
        error?.detail?.includes('username')
      ) {
        throw new BadRequestException('Username has been used!');
      } else if (
        error.message.includes('duplicate key value') &&
        error?.detail?.includes('email')
      ) {
        throw new BadRequestException('email has been used!');
      }
      throw error;
    }
  }

  async createAdmin(
    registerAdminInput: RegisterAdminInput,
  ): Promise<void | any> {
    try {
      const hashPassword = await bcrypt.hash(
        registerAdminInput.password,
        this.getSalt,
      );
      await this.usersService.createAdmin({
        ...registerAdminInput,
        password: hashPassword,
      });
    } catch (error) {
      if (
        error.message.includes('duplicate key value') &&
        error?.detail?.includes('username')
      ) {
        throw new BadRequestException('Username has been used!');
      } else if (
        error.message.includes('duplicate key value') &&
        error?.detail?.includes('email')
      ) {
        throw new BadRequestException('email has been used!');
      }
      throw error;
    }
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
