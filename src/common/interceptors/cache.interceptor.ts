import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string {
    const ctx = GqlExecutionContext.create(context);
    const cacheKey = super.trackBy(context);
    const resolverName = ctx.getInfo().fieldName;
    return `${resolverName}-${cacheKey}`;
  }
}
