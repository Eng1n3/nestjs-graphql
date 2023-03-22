import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { PaginationInput } from 'src/common/input/pagination.input';

@ArgsType()
export class GetUserInput extends PaginationInput {
  @Field({ nullable: true, defaultValue: '' })
  @IsString()
  username?: string;

  @Field({ nullable: true, defaultValue: '' })
  @IsString()
  email?: string;

  @Field({ nullable: true, defaultValue: '' })
  @IsString()
  fullname?: string;
}
