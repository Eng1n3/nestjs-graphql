import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { CreateUserInput } from './input/createuser.input';
import { GetUserInput } from './input/get-user.input';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private userService: UsersService) {}

  @Mutation(() => String)
  async createUser(@Args('input') createUserInput: CreateUserInput) {
    try {
      await this.userService.create(createUserInput);
      return 'Success create user';
    } catch (error) {
      throw error;
    }
  }

  @Query(() => [User])
  async users(@Args('search', { nullable: true }) getUserInput?: GetUserInput) {
    try {
      const dataAll = await this.userService.find(getUserInput);
      return dataAll;
    } catch (error) {
      throw error;
    }
  }
}
