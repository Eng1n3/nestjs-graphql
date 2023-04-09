/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreatePriorityInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;
}
