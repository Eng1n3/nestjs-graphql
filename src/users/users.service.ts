import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserInputWithRole } from './input/create-user.input';
import { GetUserInput } from './input/get-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(
    createUserInputWithRole: CreateUserInputWithRole,
  ): Promise<void> {
    try {
      const pathImage = 'default-image.jpg';
      const value = { ...createUserInputWithRole, pathImage };
      await this.userRepository.save(value);
    } catch (error) {
      if (
        error.message.includes('duplicate key value') &&
        error?.detail?.includes('username')
      ) {
        throw new BadRequestException('Username has been used!', error);
      } else if (
        error.message.includes('duplicate key value') &&
        error?.detail?.includes('email')
      ) {
        throw new BadRequestException('email has been used!', error);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAndCount(getUserInput: GetUserInput<User>) {
    try {
      const order = getUserInput.sort;
      const skip = getUserInput?.pagination?.skip;
      const take = getUserInput?.pagination?.take;
      const result = await this.userRepository.findAndCount({
        where: {
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
      const result = await this.userRepository.count();
      return result;
    } catch (error) {
      throw error;
    }
  }
}
