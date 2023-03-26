import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  RegisterAdminInput,
  RegisterUserInput,
} from 'src/auth/dto/register.input';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LocalAdminAuthGuard } from './guards/local-admin-auth.guard';
import { LocalUserAuthGuard } from './guards/local-user-auth.guard';
import { LoginModel } from './models/login.model';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

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
