import {
  Args,
  Int,
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
import { PriorityService } from 'src/priority/priority.service';
import { Priority } from 'src/priority/entities/priority.entity';

@Resolver((of) => Project)
export class ProjectResolver {
  constructor(
    private priorityService: PriorityService,
    private projectService: ProjectService,
    private documentService: DocumentService,
  ) {}

  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, {
    name: 'messageDeleteProject',
    description: 'message delete projek, data: "Success delete project"',
  })
  async messageDeleteProject() {
    try {
      return 'Success delete project';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, {
    name: 'messageUpdateProject',
    description: 'message update projek, data: "Success update project"',
  })
  async messageUpdateProject() {
    try {
      return 'Success update project';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, {
    name: 'messageCreateProject',
    description: 'message buat projek, data: "Success buat project"',
  })
  async messageCreateProject() {
    try {
      return 'Success buat project';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, {
    name: 'messageProject',
    description:
      'message mendapatkan projek, data: "Success mendapatkan project"',
  })
  async messageProject() {
    try {
      return 'Success mendapatkan data project';
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => Int, {
    name: 'countProjectAdmin',
    nullable: true,
    description: 'query total semua project',
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
  @Query((returns) => Int, {
    name: 'countProjectUser',
    nullable: true,
    description: 'query total project user',
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

  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Project, { name: 'deleteProject' })
  async deleteProject(@Args('idProject') idProject: string) {
    try {
      const existProject = await this.projectService.findByIdProject(idProject);
      if (!existProject)
        throw new NotFoundException('Project tidak ditemukan!');
      await this.projectService.deleteProject(idProject);
      rmSync(join(process.cwd(), `/uploads/projects/${idProject}`), {
        recursive: true,
        force: true,
      });
      return existProject;
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Project)
  async updateProject(
    @CurrentUser() user: User,
    @Args('input') updateProjectInput: UpdateProjectInput,
  ) {
    try {
      const checkPriority: Priority =
        await this.priorityService.findByIdPriority(
          updateProjectInput?.idPriority,
        );
      if (updateProjectInput?.idPriority && !checkPriority)
        throw new NotFoundException('Priority tidak ditemukan!');
      const result = await this.projectService.updateByIdProject(
        user.idUser,
        checkPriority,
        updateProjectInput,
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Project, { name: 'createProject' })
  async createProject(
    @CurrentUser() user: User,
    @Args('input') createProjectInput: CreateProjectInput,
  ) {
    try {
      const checkPriority: Priority =
        await this.priorityService.findByIdPriority(
          createProjectInput?.idPriority,
        );
      if (createProjectInput?.idPriority && !checkPriority)
        throw new NotFoundException('Priority tidak ditemukan!');
      const result = await this.projectService.create(
        user.idUser,
        createProjectInput,
      );
      return result;
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
  async project(
    @CurrentUser() user: User,
    @Args('options', { nullable: true, defaultValue: {} })
    getProjectsInput?: GetProjectsInput<Project>,
  ) {
    try {
      const result = await this.projectService.findAll(
        user?.idUser,
        getProjectsInput,
      );
      return result;
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

  @ResolveField((returns) => [DocumentEntity], {
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
