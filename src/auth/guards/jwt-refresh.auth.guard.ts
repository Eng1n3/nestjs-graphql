/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext, MiddlewareContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ROLES_KEY } from 'src/common/constants';
import { Role } from 'src/common/enums/roles.enum';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwtRefresh') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context);
      const ctx = GqlExecutionContext.create(context);
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) return true;
      const request = ctx.getContext().req;
      const user = request.user;
      return requiredRoles.some((role) => user.role?.includes(role));
    } catch (error) {
      throw error;
    }
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    request.body = ctx.getArgs();
    return request;
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Sesi anda telah berakhir!');
    }
    return user;
  }
}
