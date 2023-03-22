import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserInput } from './input/create-user.input';
import { GetUserInput } from './input/get-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private _getSkip(take: number, page: number): number {
    const skip = (page - 1) * take;
    return skip;
  }

  async create(createUserInput: CreateUserInput): Promise<void> {
    try {
      const pathImage = 'default-image.jpg';
      const value = { ...createUserInput, pathImage };
      await this.userRepository.save(value);
    } catch (error) {
      if (error.message.includes('duplicate key value')) {
        throw new BadRequestException(
          'Username or Email has been used!',
          error,
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async find(getUserInput: GetUserInput) {
    try {
      const skip = getUserInput.skip;
      const take = getUserInput.take;
      // const skip = this._getSkip(take, page);
      const getAll: Array<User> = await this.userRepository.find({
        where: {
          username: ILike(`%${getUserInput?.username}%`),
          email: ILike(`%${getUserInput?.email}%`),
          fullname: ILike(`%${getUserInput?.fullname}%`),
        },
        skip,
        take,
      });
      return getAll;
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
