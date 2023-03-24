/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import {
  CreateUserInput,
  CreateUserInputWithRole,
} from './input/create-user.input';
import { GetUserInput } from './input/get-user.input';
import { UsersModel } from './models/users.model';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private userService: UsersService) {}

  @Mutation((returns) => String, { name: 'createAdmin' })
  async createAdmin(@Args('input') createUserInput: CreateUserInput) {
    try {
      const createUserInputWithRole: CreateUserInputWithRole = {
        ...createUserInput,
        role: 'admin',
      };
      await this.userService.createUser(createUserInputWithRole);
      return 'Success create admin';
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => String, { name: 'createUser' })
  async createUser(@Args('input') createUserInput: CreateUserInput) {
    try {
      const createUserInputWithRole: CreateUserInputWithRole = {
        ...createUserInput,
        role: 'user',
      };
      await this.userService.createUser(createUserInputWithRole);
      return 'Success create user';
    } catch (error) {
      throw error;
    }
  }

  @Query((returns) => UsersModel, { name: 'users' })
  async findAll(
    @Args('options', { nullable: true }) optionsInput: GetUserInput<User>,
  ) {
    try {
      const [data, count] = await this.userService.findAndCount(optionsInput);
      return { data, count };
    } catch (error) {
      throw error;
    }
  }

  @Query((returns) => Number, { name: 'totalCount' })
  async countAll() {
    try {
      const count = await this.userService.count();
      return count;
    } catch (error) {
      throw error;
    }
  }
}
