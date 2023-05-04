import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PriorityService } from './priority.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import {
  Body,
  ClassSerializerInterceptor,
  Inject,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Priority } from './entities/priority.entity';
import { GetPrioritiesInput } from './dto/get-priority.input';
import { GraphqlRedisCacheInterceptor } from 'src/common/interceptors/cache.interceptor';
import { CacheKey } from '@nestjs/cache-manager';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { PubSub } from 'graphql-subscriptions';
import { CreatePriorityInput } from './dto/create-priority.input';
import { UpdatePriorityInput } from './dto/update-priority.input';

const PRIORITY_DELETED_EVENT = 'priorityDeleted';
const PRIORITY_UPDATED_EVENT = 'priorityUpdated';
const PRIORITY_ADDED_EVENT = 'priorityAdded';

@Resolver((of) => Priority)
export class PriorityResolver {
  constructor(
    @Inject(PUB_SUB) private pubSub: PubSub,
    private priorityService: PriorityService,
  ) {}

  @Subscription((returns) => Priority, {
    name: 'priorityDeleted',
    filter: (payload, variables) =>
      payload.priorityDeleted.title === variables.title,
  })
  wsPriorityDeleted() {
    return this.pubSub.asyncIterator(PRIORITY_DELETED_EVENT);
  }

  @Subscription((returns) => Priority, {
    name: 'priorityUpdated',
    filter: (payload, variables) =>
      payload.priorityUpdated.title === variables.title,
  })
  wsPriorityUpdated() {
    return this.pubSub.asyncIterator(PRIORITY_UPDATED_EVENT);
  }

  @Subscription((returns) => Priority, {
    name: 'priorityAdded',
    filter: (payload, variables) =>
      payload.priorityAdded.title === variables.title,
  })
  wsPriorityAdded() {
    return this.pubSub.asyncIterator(PRIORITY_ADDED_EVENT);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, {
    name: 'messageDeletePriority',
    description: 'message delete prioritas, contoh: "Success delete priority"',
  })
  async messageDeletePriority() {
    try {
      return 'Success delete Priority';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, {
    name: 'messageUpdatePriority',
    description: 'message update prioritas, contoh: "Success update priority"',
  })
  async messageUpdatePriority() {
    try {
      return 'Success update Priority';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, {
    name: 'messageCreatePriority',
    description: 'message create prioritas, contoh: "Success create priority"',
  })
  async messageCreatePriority() {
    try {
      return 'Success create Priority';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => String, {
    name: 'messagePriorities',
    description:
      'message mendapatkan prioritas, contoh: "Success mendapatkan priority"',
  })
  async messagePriorities() {
    try {
      return 'Success mendapatkan data Priority';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => Int, {
    name: 'countPriorities',
    description: 'query total prioritas, data: "1"',
    defaultValue: 0,
  })
  async projectAdminCount(
    @Args('search', { nullable: true, defaultValue: '' })
    searchPrioritiesInput?: string,
  ) {
    try {
      const count = await this.priorityService.count(searchPrioritiesInput);
      return count;
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Priority, {
    name: 'deletePriority',
    description: 'mutation delete prioritas, data: {...prioritas}',
  })
  async delete(@Args('idPriority') idPriority: string) {
    const result = await this.priorityService.delete(idPriority);
    this.pubSub.publish(PRIORITY_DELETED_EVENT, { priorityDeleted: result });
    return result;
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Priority, {
    name: 'updatePriority',
    description: 'mutation update prioritas, data: {...prioritas}',
  })
  async update(
    @Body() body: UpdatePriorityInput,
    @Args('idPriority') idPriority: string,
    @Args({ name: 'name', nullable: true }) name?: string,
    @Args({ name: 'description', nullable: true }) description?: string,
  ) {
    const result = await this.priorityService.update(
      idPriority,
      name,
      description,
    );
    this.pubSub.publish(PRIORITY_UPDATED_EVENT, { priorityUpdated: result });
    return result;
  }

  // @UseInterceptors(GraphqlRedisCacheInterceptor)
  // @CacheKey('priorities')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => [Priority], {
    name: 'priorities',
    defaultValue: [],
    description: 'query mendapatkan prioritas, data: [{...prioritas}]',
  })
  async find(
    @Args('options', { nullable: true, defaultValue: {} })
    optionsInput?: GetPrioritiesInput<Priority>,
  ) {
    const result = await this.priorityService.find(optionsInput);
    return result;
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Priority, {
    name: 'createPriority',
    description: 'mutation create prioritas, data: {...prioritas}',
  })
  async create(
    @Body() body: CreatePriorityInput,
    @Args('name') name: string,
    @Args('description') description: string,
  ) {
    const result = await this.priorityService.create(name, description);
    this.pubSub.publish(PRIORITY_ADDED_EVENT, { priorityAdded: result });
    return result;
  }
}
