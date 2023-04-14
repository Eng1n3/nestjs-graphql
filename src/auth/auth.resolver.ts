import { Inject, NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
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
import { ForgotUserModel } from './models/forgot-user.model';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';

const USER_DELETED_EVENT = 'userDeleted';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation((returns) => String, { name: 'messageForgotUser' })
  async messageForgotUser() {
    try {
      return 'Success kirim email untuk konfirmasi lupa password';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtChangePasswordAuthGuard)
  @Mutation((returns) => String, { name: 'messageChangePassword' })
  async messageChangePassword() {
    try {
      return 'Success change password';
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => String, { name: 'messageLoginAdmin' })
  async messageLoginAdmin() {
    try {
      return 'Success login admin';
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => String, { name: 'messageLoginUser' })
  async messageLoginUser() {
    try {
      return 'Success login user';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtChangePasswordAuthGuard)
  @Mutation((returns) => String, { name: 'changePassword' })
  async changePassword(
    @CurrentUser() user: User,
    @Args('input') changePasswordInput: ChangePasswordInput,
  ) {
    try {
      await this.authService.updatePassword(
        user.idUser,
        changePasswordInput.password,
      );
      return 'Change password success';
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => ForgotUserModel, { name: 'forgotUser' })
  async forgotUser(@Args('email') email: string) {
    try {
      const user = await this.authService.findUser(email);
      if (!user || (user && user.role !== 'user'))
        throw new NotFoundException('User tidak ditemukan!');
      await this.authService.sendEmail(user);
      return { email: user.email };
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => LoginModel, { name: 'loginAdmin' })
  @UseGuards(LocalAdminAuthGuard)
  async loginAdmin(
    @CurrentUser() user: User,
    @Args('email') email: string,
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
    @Args('email') email: string,
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
