/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { GetUserInput } from './dto/get-user.input';
import { UsersModel } from './models/users.model';
import { UsersService } from './users.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Project } from 'src/project/entities/project.entity';
import { UpdateAdminInput, UpdateUserInput } from './dto/update.input';
import { RegisterAdminInput, RegisterUserInput } from './dto/register.input';
import { ProjectService } from 'src/project/project.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private userService: UsersService,
    @Inject(forwardRef(() => ProjectService))
    private projectService: ProjectService,
  ) {}

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
  @Mutation((returns) => String, { name: 'updateAdmin' })
  async updateAdmin(
    @CurrentUser() user: User,
    @Args('input') updateAdminInput: UpdateAdminInput,
  ) {
    try {
      await this.userService.updateUser(user.idUser, updateAdminInput);
      return 'Success update admin account';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, { name: 'updateUser' })
  async updateUser(
    @CurrentUser() user: User,
    @Args('input') updateUserInput: UpdateUserInput,
  ) {
    try {
      await this.userService.updateUser(user.idUser, updateUserInput);
      return 'Success update user account';
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => String, { name: 'registerAdmin' })
  async registerAdmin(@Args('input') registerAdminInput: RegisterAdminInput) {
    try {
      await this.userService.createUser('admin', registerAdminInput);
      return 'Success create admin';
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => String, { name: 'registerUser' })
  async registerUser(@Args('input') registerUserInput: RegisterUserInput) {
    try {
      await this.userService.createUser('user', registerUserInput);
      return 'Success create user';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => User, { name: 'user' })
  async findOne(@CurrentUser() user: User) {
    try {
      const result = await this.userService.findOne(user.username);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
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

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => Number, { name: 'countAccountAll' })
  async countAll() {
    try {
      const count = await this.userService.count();
      return count;
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard)
  @ResolveField(() => [Project], { nullable: true, defaultValue: [] })
  async project(@Parent() user: User) {
    try {
      const result = await this.projectService.findByUser(user.idUser);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
