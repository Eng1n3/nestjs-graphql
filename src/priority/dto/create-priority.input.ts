/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { IsWordStrict } from 'src/common/decorators/is-words-strict.decorator';

@InputType()
export class CreatePriorityInput {
  @Field({ description: 'nama untuk prioritas, contoh: "nama prioritas"' })
  @IsString()
  @IsWordStrict()
  name: string;

  @Field({
    description: 'deskripsi untuk prioritas, contoh: "deskripsi prioritas"',
  })
  @IsString()
  description: string;
}
