import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  RegisterAdminInput,
  RegisterUserInput,
} from 'src/users/dto/register.input';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { JwtChangePasswordAuthGuard } from './guards/change-password.auth.guard';
import { LocalAdminAuthGuard } from './guards/local-admin-auth.guard';
import { LocalUserAuthGuard } from './guards/local-user-auth.guard';
import { LoginModel } from './models/login.model';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtChangePasswordAuthGuard)
  @Mutation((returns) => String, { name: 'changePassword' })
  async changePassword(
    @CurrentUser() user: User,
    @Args('input') changePasswordInput: ChangePasswordInput,
  ) {
    try {
      console.log(user);
      await this.authService.updatePassword(
        user.idUser,
        changePasswordInput.password,
      );
      return 'Change password success';
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => String, { name: 'forgotAdmin' })
  async forgotAdmin(@Args('usernameOrEmail') usernameOrEmail: string) {
    try {
      const user = await this.authService.findUser(usernameOrEmail);
      if (!user || (user && user.role !== 'admin'))
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
      if (!user || (user && user.role !== 'user'))
        throw new UnauthorizedException('User not found!');
      await this.authService.sendEmail(user);
      return 'Forgot password success, please check the mail inbox';
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
}
