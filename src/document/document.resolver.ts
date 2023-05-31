import {
  forwardRef,
  Inject,
  BadRequestException,
  UseGuards,
  UseInterceptors,
  HttpException,
} from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { Project } from 'src/project/entities/project.entity';
import { ProjectService } from 'src/project/project.service';
import { User } from 'src/users/entities/user.entity';
import { DocumentService } from './document.service';
import { GetDocumentsInput } from './dto/get-documents.input';
import { UpdateDocumentInput } from './dto/update-document.dto';
import { UploadDocumentInput } from './dto/upload-document.dto';
import { DocumentEntity } from './entities/document.entity';
// import { CacheKey } from '@nestjs/cache-manager';
// import { GraphqlRedisCacheInterceptor } from 'src/common/interceptors/cache.interceptor';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { PubSub } from 'graphql-subscriptions';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

const DOCUMENT_DELETED_EVENT = 'documentDeleted';
const DOCUMENT_UPDATED_EVENT = 'documentUpdated';
const DOCUMENT_ADDED_EVENT = 'documentAdded';

@Resolver((of) => DocumentEntity)
export class DocumentResolver {
  constructor(
    @Inject(PUB_SUB) private pubSub: PubSub,
    private documentService: DocumentService,
    private projectService: ProjectService,
  ) {}

  @Subscription((returns) => DocumentEntity, {
    name: 'documentDeleted',
    filter: (payload, variables) =>
      payload.documentDeleted.title === variables.title,
  })
  wsDocumentDeleted() {
    return this.pubSub.asyncIterator(DOCUMENT_DELETED_EVENT);
  }

  @Subscription((returns) => DocumentEntity, {
    name: 'documentUpdated',
    filter: (payload, variables) =>
      payload.documentUpdated.title === variables.title,
  })
  wsDocumentUpdated() {
    return this.pubSub.asyncIterator(DOCUMENT_UPDATED_EVENT);
  }

  @Subscription((returns) => DocumentEntity, {
    name: 'documentAdded',
    filter: (payload, variables) =>
      payload.documentAdded.title === variables.title,
  })
  wsDocumentAdded() {
    return this.pubSub.asyncIterator(DOCUMENT_ADDED_EVENT);
  }

  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, {
    name: 'messageDeleteDocument',
    description: 'message delete document, data: "Success delete document"',
  })
  async messageDeleteDocument() {
    return 'Success delete document';
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, {
    name: 'messageUpdateDocument',
    description: 'message update document, data: "Success update document"',
  })
  async messageUpdateDocument() {
    return 'Success update document';
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, {
    name: 'messageUploadDocument',
    description: 'message upload document, data: "Success upload document"',
  })
  async messageUploadDocument() {
    return 'Success upload document';
  }

  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => String, {
    name: 'messageDocument',
    description:
      'message mendapatkan document, data: "Success mendapatkan document"',
  })
  async messageDocument() {
    return 'Success mendapatkan data document';
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => Int, {
    name: 'countDocumentAdmin',
    nullable: true,
    description: 'query total dokumen user, data: "1"',
    defaultValue: 0,
  })
  async countDocumentAdmin(
    @CurrentUser() user: User,
    @Args('search', { nullable: true, defaultValue: '' })
    searchDocumentsInput: string,
  ) {
    const count = await this.documentService.countDocument(
      null,
      null,
      searchDocumentsInput,
    );
    return count;
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => Int, {
    name: 'countDocumentUser',
    description: 'query total semua dokumen user, data: "1"',
    defaultValue: 0,
  })
  async countByAll(
    @CurrentUser() user: User,
    @Args('search', { nullable: true, defaultValue: '' })
    searchDocumentsInput: string,
  ) {
    const count = await this.documentService.countDocument(
      user.idUser,
      null,
      searchDocumentsInput,
    );
    return count;
  }

  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => DocumentEntity, {
    name: 'deleteDocument',
    description: 'mutation delete document user, data: {...document}',
    defaultValue: {},
  })
  async deleteDocument(
    @CurrentUser() user: User,
    @Args('idDocument') idDocument: string,
  ) {
    const result = await this.documentService.deleteById(
      user.idUser,
      idDocument,
    );
    this.pubSub.publish(DOCUMENT_DELETED_EVENT, { documentDeleted: result });
    return result;
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => DocumentEntity, {
    name: 'updateDocument',
    description: 'mutation update document user, data: {...document}',
    defaultValue: {},
  })
  async updateDocument(
    @CurrentUser() user: User,
    @Args('input') updateDocumentInput: UpdateDocumentInput,
  ) {
    const result = await this.documentService.updateDocument(
      user.idUser,
      updateDocumentInput,
    );
    this.pubSub.publish(DOCUMENT_UPDATED_EVENT, { documentUpdated: result });
    return result;
  }

  // @UseInterceptors(GraphqlRedisCacheInterceptor)
  // @CacheKey('document')
  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => [DocumentEntity], {
    name: 'document',
    nullable: true,
    defaultValue: [],
    description: 'query mendapatkan document user, data: [{...document}]',
  })
  async document(
    @CurrentUser() user: User,
    @Args('options', {
      nullable: true,
      defaultValue: {},
    })
    optionsInput?: GetDocumentsInput<DocumentEntity>,
  ) {
    const result = await this.documentService.findAll(
      user?.idUser,
      null,
      optionsInput,
    );
    return result;
  }

  // @UseInterceptors(GraphqlRedisCacheInterceptor)
  // @CacheKey('documents')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => [DocumentEntity], {
    name: 'documents',
    nullable: true,
    defaultValue: [],
    description: 'query mendapatkan document semua user, data: [{...document}]',
  })
  async documents(
    @CurrentUser() user: User,
    @Args('options', { nullable: true })
    optionsInput: GetDocumentsInput<DocumentEntity>,
  ) {
    const result = await this.documentService.findAll(null, null, optionsInput);
    return result;
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => DocumentEntity, {
    name: 'uploadDocument',
    description: 'mutation upload document user, data: {...document}',
    defaultValue: {},
  })
  async uploadDocument(
    @CurrentUser() user: User,
    @Args('input') uploadDocumentInput: UploadDocumentInput,
  ) {
    const projects: Project[] = await this.projectService.findByIdUser(
      user.idUser,
    );
    const project = projects.find(
      ({ idProject }) => uploadDocumentInput.idProject === idProject,
    );
    if (!project) throw new BadRequestException('Project tidak ditemukan!');
    const result = await this.documentService.createDocument(
      uploadDocumentInput,
    );
    this.pubSub.publish(DOCUMENT_ADDED_EVENT, { documentAdded: result });
    return result;
  }
}
