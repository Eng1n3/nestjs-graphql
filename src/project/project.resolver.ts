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
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UpdateProjectInput } from './dto/update-project.input';
import { DocumentService } from 'src/document/document.service';
import { rmSync } from 'fs';
import { join } from 'path';
import { GetProjectsInput, SearchProjectInput } from './dto/get-project.input';
import { DocumentEntity } from 'src/document/entities/document.entity';
import { GetDocumentsInput } from 'src/document/dto/get-documents.input';

@Resolver((of) => Project)
export class ProjectResolver {
  constructor(
    private projectService: ProjectService,
    private documentService: DocumentService,
  ) {}

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => Number, {
    name: 'countProjectAdmin',
    nullable: true,
  })
  async projectAdminCount(
    @Args('search', { nullable: true, defaultValue: {} })
    searchProjectInput?: SearchProjectInput,
  ) {
    try {
      const count = await this.projectService.projectCount(
        null,
        searchProjectInput,
      );
      return count;
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => Number, {
    name: 'countProjectUser',
    nullable: true,
  })
  async projectCount(
    @CurrentUser() user: User,
    @Args('search', { nullable: true, defaultValue: {} })
    searchProjectInput?: SearchProjectInput,
  ) {
    try {
      const count = await this.projectService.projectCount(
        user.idUser,
        searchProjectInput,
      );
      return count;
    } catch (error) {
      throw error;
    }
  }

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
      return 'Success create project';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => [Project], {
    name: 'projects',
    nullable: true,
    defaultValue: [],
  })
  async projects(
    @CurrentUser() user: User,
    @Args('options', { nullable: true, defaultValue: {} })
    getProjectsInput?: GetProjectsInput<Project>,
  ) {
    try {
      const result = await this.projectService.findAll(null, getProjectsInput);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ResolveField(() => [DocumentEntity], {
    nullable: true,
    defaultValue: [],
    name: 'document',
  })
  async document(
    @Parent() parent: Project,
    @Args('options', { nullable: true, defaultValue: {} })
    getDocumentsInput?: GetDocumentsInput<DocumentEntity>,
  ) {
    const result = await this.documentService.findAll(
      parent.user.idUser,
      parent.idProject,
      getDocumentsInput,
    );
    return result;
  }
}
