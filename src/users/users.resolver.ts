/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { GetUserInput, SearchUserInput } from './dto/get-user.input';
import { UsersService } from './users.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateAdminInput, UpdateUserInput } from './dto/update.input';
import { RegisterAdminInput, RegisterUserInput } from './dto/register.input';
import { ComplexityEstimatorArgs } from 'graphql-query-complexity';
import { GetProjectsInput } from 'src/project/dto/get-project.input';
import { ProjectService } from 'src/project/project.service';
import { Project } from 'src/project/entities/project.entity';
import { plainToClass } from 'class-transformer';
// import { PUB_SUB } from 'src/pubsub/pubsub.module';
// import { RedisPubSub } from 'graphql-redis-subscriptions';

const USERS_EVENT = 'users';
const USER_ADDED_EVENT = 'userAdded';

// @UseInterceptors(ClassSerializerInterceptor)
@Resolver(() => User)
export class UsersResolver {
  constructor(
    private userService: UsersService,
    private projectService: ProjectService, // @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) {}

  // @Subscription((returns) => [User], {
  //   name: 'users',
  // })
  // wsUsers() {
  //   return this.pubSub.asyncIterator(USERS_EVENT);
  // }

  // @Subscription((returns) => User, {
  //   name: 'userAdded',
  // })
  // wsUserAdded() {
  //   return this.pubSub.asyncIterator(USER_ADDED_EVENT);
  // }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, { name: 'deleteUser' })
  async deleteUser(@Args('idUser') idUser: string) {
    try {
      await this.userService.deleteUser(idUser);
      return 'Success delete user';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => User, { name: 'updateAdmin' })
  async updateAdmin(
    @CurrentUser() user: User,
    @Args('input') updateAdminInput: UpdateAdminInput,
  ) {
    try {
      const result = await this.userService.updateUser(
        user.idUser,
        updateAdminInput,
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => User, { name: 'updateUser' })
  async updateUser(
    @CurrentUser() user: User,
    @Args('input') updateUserInput: UpdateUserInput,
  ) {
    try {
      const result = await this.userService.updateUser(
        user.idUser,
        updateUserInput,
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => User, { name: 'registerAdmin' })
  async registerAdmin(@Args('input') registerAdminInput: RegisterAdminInput) {
    try {
      const result = await this.userService.createUser(
        'admin',
        registerAdminInput,
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => User, { name: 'registerUser' })
  async registerUser(@Args('input') registerUserInput: RegisterUserInput) {
    try {
      const result = await this.userService.createUser(
        'user',
        registerUserInput,
      );
      // this.pubSub.publish(USER_ADDED_EVENT, { userAdded: result });
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => User, {
    name: 'user',
    complexity: (options: ComplexityEstimatorArgs) =>
      options.args.count * options.childComplexity,
  })
  async findOne(@CurrentUser() user: User) {
    try {
      const result = await this.userService.findOne(user.email);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => [User], {
    name: 'users',
    complexity: (options: ComplexityEstimatorArgs) =>
      options.args.count * options.childComplexity,
  })
  async findAll(
    @Args('options', { nullable: true, defaultValue: {} })
    optionsInput: GetUserInput<User>,
  ) {
    try {
      const result = await this.userService.find(optionsInput);
      // this.pubSub.publish(USERS_EVENT, { users: result });
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => Number, { name: 'countAccount' })
  async userCount(
    @Args('search', { nullable: true, defaultValue: {} })
    searchUserInput: SearchUserInput,
  ) {
    try {
      const count = await this.userService.count(searchUserInput);
      return count;
    } catch (error) {
      throw error;
    }
  }

  @ResolveField(() => [Project], {
    nullable: true,
    defaultValue: [],
    name: 'project',
  })
  async project(
    @Parent() parent: User,
    @Args('options', { nullable: true, defaultValue: {} })
    getProjectsINput?: GetProjectsInput<Project>,
  ) {
    const result = await this.projectService.findAll(
      parent.idUser,
      getProjectsINput,
    );
    return result;
  }
}
