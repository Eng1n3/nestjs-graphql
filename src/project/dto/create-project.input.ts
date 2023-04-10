import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DeadlineDate } from 'src/common/decorators/deadline-date.decorator';
import { IsOnlyDate } from 'src/common/decorators/is-only-date.decorator';

@InputType()
export class CreateProjectInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsDate()
  deadLine: Date;

  @Field({ nullable: true, defaultValue: null })
  @IsString()
  @IsOptional()
  idPriority: string;
}
