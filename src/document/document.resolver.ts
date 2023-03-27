import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { User } from 'src/users/entities/user.entity';
import { UpdateDocumentInput } from './dto/update-document.dto';
import { UploadDocumentInput } from './dto/upload-document.dto';
import { DocumentEntity } from './entities/document.entity';

@Resolver((of) => DocumentEntity)
export class DocumentResolver {
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => String, {
    name: 'deleteDocument',
  })
  async deleteDocument(
    @CurrentUser() user: User,
    @Args('idDocument') idDocument: string,
  ) {
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

  @Mutation((returns) => String, {
    name: 'uploadDocument',
  })
  async uploadDocument(
    @CurrentUser() user: User,
    @Args('input') uploadDocumentInput: UploadDocumentInput,
  ) {
    const document = await uploadDocumentInput.document;
    return 'Success upload document';
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => [DocumentEntity], {
    name: 'documents',
    nullable: true,
    defaultValue: [],
  })
  async documents() {
    try {
    } catch (error) {
      throw error;
    }
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Query((returns) => DocumentEntity, {
    name: 'document',
    nullable: true,
  })
  async document() {
    try {
    } catch (error) {
      throw error;
    }
  }
}
