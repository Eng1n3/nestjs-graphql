import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreatePriorityInput } from './create-priority.input';
import { IsString } from 'class-validator';

@InputType()
export class UpdatePriorityInput extends PartialType(CreatePriorityInput) {
  @Field({
    description:
      'id project berupa uuid, contoh: "0900ec8d-a3e3-46d0-ac9f-288acbdd0ew"',
  })
  @IsString()
  idPriority: string;
}
