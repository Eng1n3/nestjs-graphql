import { Field, InputType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field({ nullable: true, defaultValue: 0, description: 'Start from 0' })
  @IsNumber()
  skip: number;

  @Field({
    nullable: true,
    defaultValue: 10,
    description: 'default take 10 data',
  })
  @IsNumber()
  take: number;
}
