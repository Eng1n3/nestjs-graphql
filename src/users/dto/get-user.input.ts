import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { PaginationInput } from 'src/common/dto/pagination.input';
import { FindOptionsOrder } from 'typeorm';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class GetUserInput<T> {
  @Field((types) => PaginationInput, {
    nullable: true,
    description: '{skip: 0 or take: 0}',
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

  @Field({
    nullable: true,
    description: 'key: "cari kata"',
  })
  @IsOptional()
  search?: string;
}
