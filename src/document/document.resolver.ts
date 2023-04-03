import {
  ClassSerializerInterceptor,
  forwardRef,
  Inject,
  NotFoundException,
  UseGuards,
  UseInterceptors,
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
import {
  GetDocumentsInput,
  SearchDocumentsInput,
} from './dto/get-documents.input';
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
  @Query((returns) => Number, {
    name: 'countDocumentAdmin',
    nullable: true,
    defaultValue: [],
  })
  async countDocumentAdmin(
    @CurrentUser() user: User,
    @Args('search', { nullable: true, defaultValue: {} })
    searchDocumentsInput: SearchDocumentsInput,
  ) {
    try {
      const count = await this.documentService.countDocument(
        null,
        null,
        searchDocumentsInput,
      );
      return count;
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => Number, {
    name: 'countDocumentUser',
    nullable: true,
  })
  async countByAll(
    @CurrentUser() user: User,
    @Args('search', { nullable: true, defaultValue: {} })
    searchDocumentsInput: SearchDocumentsInput,
  ) {
    try {
      const count = await this.documentService.countDocument(
        user.idUser,
        null,
        searchDocumentsInput,
      );
      return count;
    } catch (error) {
      throw error;
    }
  }

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
    const projects: Project[] = await this.projectService.findByIdUser(
      user.idUser,
    );
    const project = projects.find(
      ({ idProject }) => updateDocumentInput.idProject === idProject,
    );
    if (!project) throw new NotFoundException('project not found');
    await this.documentService.updateDocument(updateDocumentInput);
    return 'Success update document';
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => [DocumentEntity], {
    name: 'documents',
    nullable: true,
    defaultValue: [],
  })
  async documents(
    @CurrentUser() user: User,
    @Args('options', { nullable: true })
    optionsInput: GetDocumentsInput<DocumentEntity>,
  ) {
    try {
      const result = await this.documentService.findAll(
        null,
        null,
        optionsInput,
      );
      return result;
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
      const projects: Project[] = await this.projectService.findByIdUser(
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
