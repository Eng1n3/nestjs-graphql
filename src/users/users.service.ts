/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  RegisterAdminInput,
  RegisterUserInput,
} from 'src/auth/dto/register.input';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { GetUserInput } from './dto/get-user.input';
import { ProjectService } from 'src/project/project.service';
import { Project } from 'src/project/entities/project.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private projectService: ProjectService,
  ) {}

  async projectFind(idUser: string): Promise<Project[]> {
    try {
      return await this.projectService.userFind(idUser);
    } catch (error) {
      throw error;
    }
  }

  async findOne(usernameOrEmail: string): Promise<User> {
    try {
      const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (expression.test(usernameOrEmail)) {
        return await this.userRepository.findOne({
          where: { email: usernameOrEmail },
        });
      }
      return await this.userRepository.findOne({
        where: { username: usernameOrEmail },
      });
    } catch (error) {
      throw error;
    }
  }

  async createAdmin(registerAdminInput: RegisterAdminInput): Promise<void> {
    try {
      const pathImage = 'default-image.jpg';
      const value = { ...registerAdminInput, pathImage, role: 'admin' };
      await this.userRepository.save(value);
    } catch (error) {
      throw error;
    }
  }

  async createUser(registerUserInput: RegisterUserInput): Promise<void> {
    try {
      const pathImage = 'default-image.jpg';
      const value = { ...registerUserInput, pathImage, role: 'user' };
      await this.userRepository.save(value);
    } catch (error) {
      throw error;
    }
  }

  async findAndCount(getUserInput: GetUserInput<User>) {
    try {
      const order = getUserInput.sort;
      const skip = getUserInput?.pagination?.skip;
      const take = getUserInput?.pagination?.take;
      const result = await this.userRepository.findAndCount({
        where: {
          role: 'user',
          username: ILike(`%${getUserInput?.search?.username || ''}%`),
          email: ILike(`%${getUserInput?.search?.email || ''}%`),
          fullname: ILike(`%${getUserInput?.search?.fullname || ''}%`),
        },
        skip,
        take,
        order,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async count() {
    try {
      const result = await this.userRepository.count({
        where: { role: 'user' },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}
