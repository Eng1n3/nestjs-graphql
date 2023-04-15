import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheManagerOptions,
} from '@nestjs/cache-manager';
import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) readonly cacheManager: CacheManagerOptions,
    readonly reflector: Reflector,
  ) {
    super(cacheManager, reflector);
  }

  trackBy(context: ExecutionContext): string {
    return 'oke';
  }
}
