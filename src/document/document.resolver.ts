import {
  forwardRef,
  Inject,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { Project } from 'src/project/entities/project.entity';
import { ProjectService } from 'src/project/project.service';
import { User } from 'src/users/entities/user.entity';
import { DocumentService } from './document.service';
import { UpdateDocumentInput } from './dto/update-document.dto';
import { UploadDocumentInput } from './dto/upload-document.dto';
import { DocumentEntity } from './entities/document.entity';

@Resolver((of) => DocumentEntity)
export class DocumentResolver {
  constructor(
    private documentService: DocumentService,
    @Inject(forwardRef(() => ProjectService))
    private projectService: ProjectService,
  ) {}

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, {
    name: 'deleteDocument',
  })
  async deleteDocument(
    @CurrentUser() user: User,
    @Args('idDocument') idDocument: string,
  ) {
    await this.documentService.deleteById(idDocument);
    return 'Success delete document';
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, {
    name: 'updateDocument',
  })
  async updateDocument(
    @CurrentUser() user: User,
    @Args('input') updateDocumentInput: UpdateDocumentInput,
  ) {
    return 'Success update document';
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => [DocumentEntity], {
    name: 'documents',
    nullable: true,
    defaultValue: [],
  })
  async documents(@CurrentUser() user: User) {
    try {
      return [];
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => [DocumentEntity], {
    name: 'document',
    nullable: true,
  })
  async document(@CurrentUser() user: User) {
    try {
      const projects = await this.projectService.findByUser(user.idUser);
      const idProjects = projects?.map((project) => project.idProject);
      const documents = await this.documentService.findAll(idProjects);
      return documents;
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, {
    name: 'uploadDocument',
  })
  async uploadDocument(
    @CurrentUser() user: User,
    @Args('input') uploadDocumentInput: UploadDocumentInput,
  ) {
    try {
      const projects: Project[] = await this.projectService.findByUser(
        user.idUser,
      );
      const project = projects.find(
        ({ idProject }) => uploadDocumentInput.idProject === idProject,
      );
      if (!project) throw new NotFoundException('project not found');
      await this.documentService.createDocument(uploadDocumentInput);
      return 'Success upload document';
    } catch (error) {
      throw error;
    }
  }
}
