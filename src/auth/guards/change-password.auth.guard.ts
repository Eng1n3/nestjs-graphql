import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ROLES_KEY } from 'src/common/constants';
import { Role } from 'src/common/enums/roles.enum';

@Injectable()
export class JwtChangePasswordAuthGuard extends AuthGuard('changePassword') {
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
    return ctx.getContext().req;
  }
}
