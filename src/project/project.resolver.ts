import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Project } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { ProjectService } from './project.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import {
  forwardRef,
  Inject,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UpdateProjectInput } from './dto/update-project.input';
import { DocumentEntity } from 'src/document/entities/document.entity';
import { DocumentService } from 'src/document/document.service';
import { rmSync } from 'fs';
import { join } from 'path';

@Resolver((of) => Project)
export class ProjectResolver {
  constructor(
    private projectService: ProjectService,
    @Inject(forwardRef(() => DocumentService))
    private documentService: DocumentService,
  ) {}

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String)
  async deleteProject(@Args('idProject') idProject: string) {
    try {
      const existProject = await this.projectService.findByIdProject(idProject);
      if (!existProject) throw new NotFoundException('project not found!');
      await this.documentService.deleteByIdProject(idProject);
      await this.projectService.deleteProject(idProject);
      rmSync(join(process.cwd(), `/uploads/projects/${idProject}`), {
        recursive: true,
        force: true,
      });
      return 'Success delete project';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String)
  async updateProject(
    @CurrentUser() user: User,
    @Args('input') updateProjectInput: UpdateProjectInput,
  ) {
    try {
      await this.projectService.updateByIdProject(
        user.idUser,
        updateProjectInput,
      );
      return 'Success update project';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String)
  async createProject(
    @CurrentUser() user: User,
    @Args('input') createProjectInput: CreateProjectInput,
  ) {
    try {
      await this.projectService.create(user.idUser, createProjectInput);
      return 'Success create user';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => [Project], {
    name: 'project',
    nullable: true,
    defaultValue: [],
  })
  async project(@CurrentUser() user: User) {
    try {
      const projects = await this.projectService.findByUser(user.idUser);
      return projects;
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => [Project])
  async projects(@CurrentUser() user: User) {
    try {
      const result = await this.projectService.findAll();
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard)
  @ResolveField(() => [DocumentEntity], { nullable: true, defaultValue: [] })
  async document(@Parent() projectParent: Project) {
    try {
      const result = await this.documentService.getByIdProject(
        projectParent.idProject,
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
