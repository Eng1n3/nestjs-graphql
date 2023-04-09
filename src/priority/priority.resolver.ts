import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PriorityService } from './priority.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import {
  ClassSerializerInterceptor,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Priority } from './entities/priority.entity';
import {
  GetPrioritiesInput,
  SearchPrioritiesInput,
} from './dto/get-priority.input';

@Resolver()
export class PriorityResolver {
  constructor(private priorityService: PriorityService) {}

  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => Number, {
    name: 'countPriorities',
    nullable: true,
  })
  async projectAdminCount(
    @Args('search', { nullable: true, defaultValue: {} })
    searchPrioritiesInput?: SearchPrioritiesInput,
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
  @Mutation((returns) => Priority, { name: 'deletePriority', defaultValue: [] })
  async delete(@Args('idPriority') idPriority: string) {
    const result = await this.priorityService.delete(idPriority);
    return result;
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Priority, { name: 'updatePriority', defaultValue: [] })
  async update(
    @Args('idPriority') idPriority: string,
    @Args('name') name: string,
    @Args('description') description: string,
  ) {
    const result = await this.priorityService.update(
      idPriority,
      name,
      description,
    );
    return result;
  }

  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Query((returns) => [Priority], { name: 'priorities', defaultValue: [] })
  async find(
    @Args('options', { nullable: true, defaultValue: {} })
    optionsInput?: GetPrioritiesInput<Priority>,
  ) {
    const result = await this.priorityService.find(optionsInput);
    return result;
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Priority, { name: 'createPriority', defaultValue: [] })
  async create(
    @Args('name') name: string,
    @Args('description') description: string,
  ) {
    const result = await this.priorityService.create(name, description);
    return result;
  }
}
