/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Args,
  // Directive,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { GetUserInput } from './dto/get-user.input';
import { UsersService } from './users.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import {
  // CacheKey,
  // CacheTTL,
  Inject,
  UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateUserInput } from './dto/update.input';
import { RegisterUserInput } from './dto/register.input';
import { ComplexityEstimatorArgs } from 'graphql-query-complexity';
import { GetProjectsInput } from 'src/project/dto/get-project.input';
import { ProjectService } from 'src/project/project.service';
import { Project } from 'src/project/entities/project.entity';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlRedisCacheInterceptor } from 'src/common/interceptors/cache.interceptor';
import { CacheControl } from 'nestjs-gql-cache-control';
// import { RedisPubSub } from 'graphql-redis-subscriptions';

const USER_ADDED_EVENT = 'userAdded';
const USER_UPDATED_EVENT = 'userUpdated';
const USER_DELETED_EVENT = 'userDeleted';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private userService: UsersService,
    private projectService: ProjectService,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}

  @Subscription((returns) => User, {
    name: 'userDeleted',
    filter: (payload, variables) =>
      payload.userDeleted.title === variables.title,
  })
  wsUserDeleted() {
    return this.pubSub.asyncIterator(USER_DELETED_EVENT);
  }

  @Subscription((returns) => User, {
    name: 'userUpdated',
    filter: (payload, variables) =>
      payload.userUpdated.title === variables.title,
  })
  wsUserUpdated() {
    return this.pubSub.asyncIterator(USER_UPDATED_EVENT);
  }

  @Subscription((returns) => User, {
    name: 'userAdded',
    filter: (payload, variables) => payload.userAdded.title === variables.title,
  })
  wsUserAdded() {
    return this.pubSub.asyncIterator(USER_ADDED_EVENT);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, {
    name: 'messageDeleteUser',
    description: 'message delete user, contoh: "Success delete user"',
  })
  async messageDeleteUser() {
    return 'Success delete user';
  }

  @Mutation((returns) => String, {
    name: 'messageRegisterUser',
    description: 'message registrasi user, contoh: "Success registrasi user"',
  })
  async messageRegister() {
    return 'Success registrasi user';
  }

  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => String, {
    name: 'messageUser',
    description:
      'message mendapatkan user, contoh: "Success mendapatkan data user"',
  })
  async messageUser() {
    return 'Success mendapatkan data user';
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, {
    name: 'messageUpdateUser',
    description: 'message update user, contoh: "Success update user"',
  })
  async messageUpdateUser() {
    return 'Success update user';
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => User, {
    name: 'deleteUser',
    description: 'Mutation delete user, contoh: {...user}',
  })
  async deleteUser(@Args('idUser') idUser: string) {
    const result = await this.userService.deleteUser(idUser);
    this.pubSub.publish(USER_DELETED_EVENT, { userDeleted: result });
    return result;
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => User, {
    name: 'updateUser',
    description: 'mutation update akun, data: {...user}',
  })
  async updateUser(
    @CurrentUser() user: User,
    @Args('input') updateUserInput: UpdateUserInput,
  ) {
    const result = await this.userService.updateUser(
      user.idUser,
      updateUserInput,
    );
    this.pubSub.publish(USER_UPDATED_EVENT, { userUpdated: result });
    return result;
  }

  @Mutation((returns) => User, {
    name: 'registerUser',
    description: 'mutation register akun, data: {...user}',
  })
  async registerUser(@Args('input') registerUserInput: RegisterUserInput) {
    const result = await this.userService.createUser('user', registerUserInput);
    this.pubSub.publish(USER_ADDED_EVENT, { userAdded: result });
    return result;
  }

  // @UseInterceptors(GraphqlRedisCacheInterceptor)
  // @CacheTTL(90)
  // @CacheKey('user')
  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => User, {
    name: 'user',
    complexity: (options: ComplexityEstimatorArgs) =>
      options.args.count * options.childComplexity,
    description: 'query mendapatkan akun, data: {...user}',
  })
  async findOne(@CurrentUser() user: User) {
    const result = await this.userService.findOneByEmail(user.email);
    return result;
  }

  // @UseInterceptors(GraphqlRedisCacheInterceptor)
  // @CacheTTL(90)
  // @CacheKey('users')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => [User], {
    name: 'users',
    complexity: (options: ComplexityEstimatorArgs) =>
      options.args.count * options.childComplexity,
    description: 'query mendapatkan semua akun, data: [{...user}]',
  })
  async findAll(
    @Args('options', { nullable: true, defaultValue: {} })
    optionsInput?: GetUserInput<User>,
  ) {
    const result = await this.userService.findAll(optionsInput);
    return result;
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => Int, {
    name: 'countAccount',
    description: 'query total akun user',
  })
  async userCount(
    @Args('search', { nullable: true, defaultValue: '' })
    searchUserInput?: string,
  ) {
    const count = await this.userService.count(searchUserInput);
    return count;
  }

  @ResolveField(() => [Project], {
    nullable: true,
    defaultValue: [],
    name: 'countProject',
    description: 'resolver project berdasarkan user, data: [{...project}]',
  })
  async countProject(
    @Parent() parent: User,
    @Args('options', { nullable: true, defaultValue: {} })
    getProjectsInput?: GetProjectsInput<Project>,
  ) {
    const result = await this.projectService.findAll(
      parent.idUser,
      getProjectsInput,
    );
    return result;
  }

  @ResolveField(() => [Project], {
    nullable: true,
    defaultValue: [],
    name: 'project',
    description: 'resolver project berdasarkan user, data: [{...project}]',
  })
  async project(
    @Parent() parent: User,
    @Args('options', { nullable: true, defaultValue: {} })
    getProjectsInput?: GetProjectsInput<Project>,
  ) {
    const result = await this.projectService.findAll(
      parent.idUser,
      getProjectsInput,
    );
    return result;
  }
}
