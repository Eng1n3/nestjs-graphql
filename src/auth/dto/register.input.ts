import { Field, InputType, OmitType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

@InputType()
export class RegisterUserInput {
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

@InputType()
export class RegisterAdminInput extends OmitType(RegisterUserInput, [
  'bio',
  'fullname',
  'homepage',
]) {}
