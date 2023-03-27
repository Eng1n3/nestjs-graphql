import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  RegisterAdminInput,
  RegisterUserInput,
} from 'src/auth/dto/register.input';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateAdminInput, UpdateUserInput } from './dto/update.input';
import { JwtChangePasswordAuthGuard } from './guards/change-password.auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAdminAuthGuard } from './guards/local-admin-auth.guard';
import { LocalUserAuthGuard } from './guards/local-user-auth.guard';
import { LoginModel } from './models/login.model';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, { name: 'deleteUser' })
  async deleteUser(@Args('idUser') idUser: string) {
    try {
      return 'Success delete user';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtChangePasswordAuthGuard)
  @Mutation((returns) => String, { name: 'forgotUser' })
  async chagePasswordUser(
    @CurrentUser() user: User,
    @Args('input') changePasswordInput: ChangePasswordInput,
  ) {
    try {
      return 'Change password success';
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => String, { name: 'forgotAdmin' })
  async forgotAdmin(@Args('usernameOrEmail') usernameOrEmail: string) {
    try {
      const user = await this.authService.findUser(usernameOrEmail);
      if (user && user.role !== 'admin')
        throw new UnauthorizedException('User not found!');
      await this.authService.sendEmail(user);
      return 'Forgot password success, please check the mail inbox';
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => String, { name: 'forgotUser' })
  async forgotUser(@Args('usernameOrEmail') usernameOrEmail: string) {
    try {
      const user = await this.authService.findUser(usernameOrEmail);
      if (user && user.role !== 'user')
        throw new UnauthorizedException('User not found!');
      await this.authService.sendEmail(user);
      return 'Forgot password success, please check the mail inbox';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, { name: 'updateAdmin' })
  async updateAdmin(@Args('input') updateAdminInput: UpdateAdminInput) {
    try {
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, { name: 'updateUser' })
  async updateUser(@Args('input') updateUserInput: UpdateUserInput) {
    try {
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => LoginModel, { name: 'loginAdmin' })
  @UseGuards(LocalAdminAuthGuard)
  async loginAdmin(
    @CurrentUser() user: User,
    @Args('usernameOrEmail') usernameOrPassword: string,
    @Args('password') password: string,
  ) {
    try {
      const token = await this.authService.login(user);
      return { token };
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => LoginModel, { name: 'loginUser' })
  @UseGuards(LocalUserAuthGuard)
  async loginUser(
    @CurrentUser() user: User,
    @Args('usernameOrEmail') usernameOrPassword: string,
    @Args('password') password: string,
  ) {
    try {
      const token = await this.authService.login(user);
      return { token };
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => String, { name: 'registerAdmin' })
  async registerAdmin(@Args('input') registerAdminInput: RegisterAdminInput) {
    try {
      await this.authService.createAdmin(registerAdminInput);
      return 'Success create admin';
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => String, { name: 'registerUser' })
  async registerUser(@Args('input') registerUserInput: RegisterUserInput) {
    try {
      await this.authService.createUser(registerUserInput);
      return 'Success create user';
    } catch (error) {
      throw error;
    }
  }
}
