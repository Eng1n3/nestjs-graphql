import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { PaginationInput } from 'src/common/dto/pagination.input';
import { FindOptionsOrder } from 'typeorm';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class SearchProjectInput {
  @Field({ nullable: true, defaultValue: '' })
  @IsString()
  @IsOptional()
  idProject?: string;

  @Field({ nullable: true, defaultValue: '' })
  @IsString()
  @IsOptional()
  projectName?: string;

  @Field({ nullable: true, defaultValue: '' })
  @IsString()
  @IsOptional()
  description?: string;
}

@InputType()
export class GetProjectsInput<T> {
  @Field((types) => PaginationInput, { nullable: true })
  @IsOptional()
  pagination?: PaginationInput;

  @Field((types) => GraphQLJSON, {
    nullable: true,
    description:
      '{key: "ASC" or "DESC" or "asc" or "desc" or 1 or -1} or {key: {direction: "ASC" or "DESC" or "asc" or "desc", nulls: "first" or "last" or "FIRST" or "LAST"}}}',
  })
  @IsOptional()
  sort?: FindOptionsOrder<T>;

  @Field((types) => SearchProjectInput, { nullable: true })
  @IsOptional()
  search?: SearchProjectInput;
}
