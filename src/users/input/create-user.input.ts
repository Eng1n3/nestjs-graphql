import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @Match('password', { message: 'repassword must be match to password' })
  repassword: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  homepage?: string;
}

@ObjectType()
export class CreateUserInputWithRole extends PartialType(CreateUserInput) {
  @Field()
  @IsString()
  role?: string;
}
