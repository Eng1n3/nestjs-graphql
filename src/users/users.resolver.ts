/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PaginationInput } from 'src/common/input/pagination.input';
import { DocumentEntity } from 'src/document/entities/document.entity';
import { Project } from 'src/project/entities/project.entity';
import { User } from './entities/user.entity';
import { CreateUserInput } from './input/create-user.input';
import { GetUserInput } from './input/get-user.input';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private userService: UsersService) {}

  @Mutation((returns) => String)
  async createUser(@Args('input') createUserInput: CreateUserInput) {
    try {
      await this.userService.create(createUserInput);
      return 'Success create user';
    } catch (error) {
      throw error;
    }
  }

  @Query((returns) => [User], { name: 'users' })
  async findAll(
    @Args()
    getUserInput?: GetUserInput,
  ) {
    try {
      const dataAll = await this.userService.find(getUserInput);
      return dataAll;
    } catch (error) {
      throw error;
    }
  }

  @Query((returns) => Number, { name: 'usersCount' })
  async countAll() {
    try {
      const count = await this.userService.count();
      return count;
    } catch (error) {
      throw error;
    }
  }
}
