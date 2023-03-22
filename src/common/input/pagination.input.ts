import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@ArgsType()
export class PaginationInput {
  @Field({ nullable: true, defaultValue: 0 })
  @IsNumber()
  skip: number;

  @Field({ nullable: true, defaultValue: 10 })
  @IsNumber()
  take: number;
}
