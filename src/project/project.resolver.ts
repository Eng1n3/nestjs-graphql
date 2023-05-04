import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Project } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { ProjectService } from './project.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import {
  Inject,
  NotFoundException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UpdateProjectInput } from './dto/update-project.input';
import { DocumentService } from 'src/document/document.service';
import { rmSync } from 'fs';
import { join } from 'path';
import { GetProjectsInput } from './dto/get-project.input';
import { DocumentEntity } from 'src/document/entities/document.entity';
import { GetDocumentsInput } from 'src/document/dto/get-documents.input';
import { PriorityService } from 'src/priority/priority.service';
import { Priority } from 'src/priority/entities/priority.entity';
import { GraphqlRedisCacheInterceptor } from 'src/common/interceptors/cache.interceptor';
import { CacheKey } from '@nestjs/cache-manager';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { PubSub } from 'graphql-subscriptions';
import { ComplexityEstimatorArgs } from 'graphql-query-complexity';
import { CountProjectByDate } from './models/count-project-by-date.mode';
import { YearProjectModel } from './models/year-project.model';

const PROJECT_DELETED_EVENT = 'projectDeleted';
const PROJECT_UPDATED_EVENT = 'projectUpdated';
const PROJECT_ADDED_EVENT = 'projectAdded';

@Resolver((of) => Project)
export class ProjectResolver {
  constructor(
    @Inject(PUB_SUB) private pubSub: PubSub,
    private priorityService: PriorityService,
    private projectService: ProjectService,
    private documentService: DocumentService,
  ) {}

  @Subscription((returns) => Project, {
    name: 'projectDeleted',
    filter: (payload, variables) =>
      payload.projectDeleted.title === variables.title,
  })
  wsProjectDeleted() {
    return this.pubSub.asyncIterator(PROJECT_DELETED_EVENT);
  }

  @Subscription((returns) => Project, {
    name: 'projectUpdated',
    filter: (payload, variables) =>
      payload.projectUpdated.title === variables.title,
  })
  wsProjectUpdated() {
    return this.pubSub.asyncIterator(PROJECT_UPDATED_EVENT);
  }

  @Subscription((returns) => Project, {
    name: 'projectAdded',
    filter: (payload, variables) =>
      payload.projectAdded.title === variables.title,
  })
  wsProjectAdded() {
    return this.pubSub.asyncIterator(PROJECT_ADDED_EVENT);
  }

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
  @Query((returns) => String, {
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
    description: 'query total semua project',
    defaultValue: 0,
  })
  async projectAdminCount(
    @Args('search', { nullable: true, defaultValue: '' })
    searchProjectInput?: string,
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
    description: 'query total project user',
    defaultValue: 0,
  })
  async projectCount(
    @CurrentUser() user: User,
    @Args('search', { nullable: true, defaultValue: '' })
    searchProjectInput?: string,
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

  // @UseInterceptors(GraphqlRedisCacheInterceptor)
  // @CacheKey('yearProject')
  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => [YearProjectModel], {
    name: 'yearProject',
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) =>
      options.args.count * options.childComplexity,
    description:
      'query mendapatkan tahun pembuatan project user, data: [number]',
  })
  async yearProject(
    @CurrentUser() user: User,
    @Args('limit', { type: () => Int, defaultValue: 5, nullable: true })
    limit?: number,
  ) {
    try {
      const result = await this.projectService.yearProject(user.idUser, limit);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // @UseInterceptors(GraphqlRedisCacheInterceptor)
  // @CacheKey('project')
  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => [CountProjectByDate], {
    name: 'countProjectByDate',
    complexity: (options: ComplexityEstimatorArgs) =>
      options.args.count * options.childComplexity,
    description:
      'query mendapatkan project user berdasarkan filter dari tangggal, data: [{...project}]',
  })
  async countProjectFilterByDate(
    @CurrentUser() user: User,
    @Args('year', {
      type: () => Int,
      defaultValue: new Date().getFullYear(),
      nullable: true,
    })
    year?: number,
  ) {
    try {
      const idUser = user.idUser;
      const result = await this.projectService.countProjectByDate(idUser, year);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Project, {
    name: 'deleteProject',
    description: 'mutation delete project, data: {...project}',
  })
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
      this.pubSub.publish(PROJECT_DELETED_EVENT, {
        projectDeleted: existProject,
      });
      return existProject;
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Project, {
    description: 'mutation update project, data: {...project}',
  })
  async updateProject(
    @CurrentUser() user: User,
    @Args('input') updateProjectInput: UpdateProjectInput,
  ) {
    try {
      const priority: Priority = await this.priorityService.findOneByIdPriority(
        updateProjectInput?.idPriority,
      );
      if (updateProjectInput?.idPriority && !priority)
        throw new NotFoundException('Priority tidak ditemukan!');
      const result = await this.projectService.updateByIdProject(
        user.idUser,
        priority,
        updateProjectInput,
      );
      this.pubSub.publish(PROJECT_UPDATED_EVENT, { projectUpdated: result });
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Project, {
    name: 'createProject',
    defaultValue: {},
    description: 'mutation create project, data: {...project}',
  })
  async createProject(
    @CurrentUser() user: User,
    @Args('input') createProjectInput: CreateProjectInput,
  ) {
    try {
      const priority = await this.priorityService.findOneByIdPriority(
        createProjectInput?.idPriority,
      );

      if (createProjectInput?.idPriority && !priority)
        throw new NotFoundException('Priority tidak ditemukan!');

      const result = await this.projectService.create(
        user.idUser,
        createProjectInput,
        createProjectInput?.idPriority,
      );
      this.pubSub.publish(PROJECT_ADDED_EVENT, { projectAdded: result });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // @UseInterceptors(GraphqlRedisCacheInterceptor)
  // @CacheKey('project')
  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => [Project], {
    name: 'project',
    complexity: (options: ComplexityEstimatorArgs) =>
      options.args.count * options.childComplexity,
    description: 'query mendapatkan project user, data: [{...project}]',
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

  // @UseInterceptors(GraphqlRedisCacheInterceptor)
  // @CacheKey('projects')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => [Project], {
    name: 'projects',
    nullable: true,
    defaultValue: [],
    description: 'query mendapatkan project semua user, data: [{...project}]',
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
    description: 'resolver dokumen berdasarkan project, data: [{...document}]',
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
