import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
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
import { GetPrioritiesInput } from './dto/get-priority.input';

@Resolver()
export class PriorityResolver {
  constructor(private priorityService: PriorityService) {}

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
    return result;
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Priority, {
    name: 'updatePriority',
    description: 'mutation update prioritas, data: {...prioritas}',
  })
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
    @Args('name') name: string,
    @Args('description') description: string,
  ) {
    const result = await this.priorityService.create(name, description);
    return result;
  }
}
