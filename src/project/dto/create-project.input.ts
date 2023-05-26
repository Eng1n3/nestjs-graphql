import { Field, InputType } from '@nestjs/graphql';
import { Escape, sanitize } from 'class-sanitizer';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsDeadlineDate } from 'src/common/decorators/deadline-date.decorator';
import { IsOnlyDate } from 'src/common/decorators/is-only-date.decorator';

@InputType()
export class CreateProjectInput {
  @Field({ description: 'nama project, contoh: "nama project"' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitize(value))
  projectName: string;

  @Field({ description: 'deskripsi project, contoh: "deskripsi project"' })
  @IsNotEmpty()
  @Escape()
  description: string;

  @Field({
    description: 'dead line project berupa tanggal, contoh: "2002-03-23"',
  })
  // @IsDate()
  @IsOnlyDate()
  @IsDeadlineDate()
  @Escape()
  deadLine: string;

  @Field({
    nullable: true,
    defaultValue: null,
    description:
      'id prioritas berupa uuid, contoh: "0900ec8d-a3e3-46d0-ac9f-288acbdd0ew"',
  })
  @IsString()
  @IsOptional()
  idPriority: string;
}
