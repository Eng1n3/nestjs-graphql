import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class GetUserInput {
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
