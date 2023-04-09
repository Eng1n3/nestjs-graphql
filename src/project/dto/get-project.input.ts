import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { PaginationInput } from 'src/common/dto/pagination.input';
import { FindOptionsOrder } from 'typeorm';
import GraphQLJSON from 'graphql-type-json';
import { CreateProjectInput } from './create-project.input';

@InputType()
export class SearchProjectInput extends PartialType(
  OmitType(CreateProjectInput, ['idPriority', 'deadLine']),
) {
  @Field({ nullable: true, defaultValue: null })
  @IsOptional()
  priority?: string;
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
