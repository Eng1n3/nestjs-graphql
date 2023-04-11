import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
  // @IsDate()
  @IsOnlyDate()
  deadLine: string;

  @Field({ nullable: true, defaultValue: null })
  @IsString()
  @IsOptional()
  idPriority: string;
}
