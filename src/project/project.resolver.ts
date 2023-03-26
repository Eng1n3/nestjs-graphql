import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Project } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { ProjectService } from './project.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Roles(Role.User)
@UseGuards(JwtAuthGuard)
@Resolver(() => Project)
export class ProjectResolver {
  constructor(private projectService: ProjectService) {}

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  async createProject(
    @CurrentUser() user: User,
    @Args('input') createProjectInput: CreateProjectInput,
  ) {
    try {
      const createProject = { ...createProjectInput, idUser: user.idUser };
      await this.projectService.create(createProject);
      return 'Success create user';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard)
  @Query(() => Project)
  async project(@CurrentUser() user: User) {
    try {
      const result = await this.projectService.userFind(user.idUser);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
