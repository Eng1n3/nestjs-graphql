import { Inject, BadRequestException, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
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
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const USER_DELETED_EVENT = 'userDeleted';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation((returns) => String, { name: 'messageForgotUser' })
  async messageForgotUser() {
    return 'Success kirim email untuk konfirmasi lupa password';
  }

  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtChangePasswordAuthGuard)
  @Mutation((returns) => String, { name: 'messageChangePassword' })
  async messageChangePassword() {
    return 'Success change password';
  }

  @Mutation((returns) => String, { name: 'messageLoginAdmin' })
  async messageLoginAdmin() {
    return 'Success login admin';
  }

  @Mutation((returns) => String, { name: 'messageLoginUser' })
  async messageLoginUser() {
    return 'Success login user';
  }

  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtRefreshAuthGuard)
  @Query((returns) => LoginModel, { name: 'refreshToken' })
  async refreshToken(@CurrentUser() user: User) {
    const token = await this.authService.login(user);
    const tokenRefresh = this.authService.refreshToken(user);
    return { token, tokenRefresh };
  }

  @Roles(Role.User)
  @UseGuards(JwtChangePasswordAuthGuard)
  @Mutation((returns) => String, { name: 'changePassword' })
  async changePassword(
    @CurrentUser() user: User,
    @Args('input') changePasswordInput: ChangePasswordInput,
  ) {
    await this.authService.updatePassword(
      user.idUser,
      changePasswordInput.password,
    );
    return 'Change password success';
  }

  @Mutation((returns) => ForgotUserModel, { name: 'forgotUser' })
  async forgotUser(@Args('email') email: string) {
    const user = await this.authService.findUser(email);
    if (!user || (user && user.role !== 'user'))
      throw new BadRequestException('User tidak ditemukan!');
    await this.authService.sendEmail(user);
    return { email: user.email };
  }

  @UseGuards(LocalAdminAuthGuard)
  @Mutation((returns) => LoginModel, { name: 'loginAdmin' })
  async loginAdmin(
    @CurrentUser() user: User,
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const token = await this.authService.login(user);
    const tokenRefresh = this.authService.refreshToken(user);
    return { token, tokenRefresh };
  }

  @UseGuards(LocalUserAuthGuard)
  @Mutation((returns) => LoginModel, { name: 'loginUser' })
  async loginUser(
    @Context() context: any,
    @CurrentUser() user: User,
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const token = await this.authService.login(user);
    const tokenRefresh = this.authService.refreshToken(user);
    return { token, tokenRefresh };
  }
}
