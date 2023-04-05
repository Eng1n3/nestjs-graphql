import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { PaginationInput } from 'src/common/dto/pagination.input';
import { FindOptionsOrder } from 'typeorm';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class SearchUserInput {
  @Field({ nullable: true, defaultValue: '' })
  @IsString()
  @IsOptional()
  email?: string;

  @Field({ nullable: true, defaultValue: '' })
  @IsString()
  @IsOptional()
  fullname?: string;
}

@InputType()
export class GetUserInput<T> {
  @Field((types) => PaginationInput, { nullable: true })
  @IsOptional()
  pagination?: PaginationInput;

  @Field(() => GraphQLJSON, {
    nullable: true,
    description:
      '{key: "ASC" or "DESC" or "asc" or "desc" or 1 or -1} or {key: {direction: "ASC" or "DESC" or "asc" or "desc", nulls: "first" or "last" or "FIRST" or "LAST"}}}',
  })
  @IsOptional()
  sort?: FindOptionsOrder<T>;

  @Field((types) => SearchUserInput, { nullable: true })
  @IsOptional()
  search?: SearchUserInput;
}
