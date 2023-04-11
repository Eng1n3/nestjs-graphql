import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { PaginationInput } from 'src/common/dto/pagination.input';
import { FindOptionsOrder } from 'typeorm';
import GraphQLJSON from 'graphql-type-json';
import { UploadDocumentInput } from './upload-document.dto';

@InputType()
export class SearchDocumentsInput extends PartialType(
  OmitType(UploadDocumentInput, ['file', 'idProject']),
) {
  @Field({
    nullable: true,
    defaultValue: '',
    description: 'data path document user, example: "http://domain.com/path"',
  })
  @IsString()
  @IsOptional()
  pathDocument?: string;
}

@InputType()
export class GetDocumentsInput<T> {
  @Field((types) => PaginationInput, {
    nullable: true,
    description: '{skip: 0 or take: 10}',
  })
  @IsOptional()
  pagination?: PaginationInput;

  @Field(() => GraphQLJSON, {
    nullable: true,
    description:
      '{key: "ASC" or "DESC" or "asc" or "desc" or 1 or -1} or {key: {direction: "ASC" or "DESC" or "asc" or "desc", nulls: "first" or "last" or "FIRST" or "LAST"}}}',
  })
  @IsOptional()
  sort?: FindOptionsOrder<T>;

  @Field((types) => SearchDocumentsInput, {
    nullable: true,
    description: '{key: "cari apa"}',
  })
  @IsOptional()
  search?: SearchDocumentsInput;
}
