/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { RegisterAdminInput, RegisterUserInput } from './dto/register.input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private getSalt = bcrypt.genSaltSync();

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
