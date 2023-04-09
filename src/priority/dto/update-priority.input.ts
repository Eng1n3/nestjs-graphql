import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreatePriorityInput } from './create-priority.input';
import { IsString } from 'class-validator';

@InputType()
export class UpdatePriorityInput extends PartialType(CreatePriorityInput) {
  @Field()
  @IsString()
  idPriority: string;
}
