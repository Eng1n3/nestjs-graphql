import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  CACHE_MANAGER,
  CACHE_TTL_METADATA,
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RedisCache } from 'apollo-server-cache-redis';
import { Observable, tap } from 'rxjs';

@Injectable()
export class GraphqlRedisCacheInterceptor extends CacheInterceptor {
  @Inject(CACHE_MANAGER) private redisManager: RedisCache;
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const cacheTTL = this.reflector.get(
      CACHE_TTL_METADATA,
      context.getHandler(),
    );
    const gqlCtx = GqlExecutionContext.create(context);
    const pathKey = gqlCtx.getInfo().path.key;
    const resolverName = gqlCtx.getInfo().fieldName;
    const cacheKey = `${pathKey}-${resolverName}`;
    const cachedValue = await this.cacheManager.get(cacheKey);
    if (cachedValue) {
      return cachedValue as unknown as Observable<string>;
    }
    return next.handle().pipe(
      tap(async (result) => {
        await this.redisManager.set(cacheKey, result, { ttl: cacheTTL });
      }),
    );
  }
}
