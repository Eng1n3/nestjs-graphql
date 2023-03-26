/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { GetUserInput } from './dto/get-user.input';
import { UsersModel } from './models/users.model';
import { UsersService } from './users.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Project } from 'src/project/entities/project.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private userService: UsersService) {}

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
  @Query((returns) => Number, { name: 'totalCount' })
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
      const result = await this.userService.projectFind(user.idUser);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
