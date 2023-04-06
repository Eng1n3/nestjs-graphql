import { Field, InputType, OmitType } from '@nestjs/graphql';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { IsOnlyDate } from 'src/common/decorators/is-only-date.decorator';
import { Match } from 'src/common/decorators/match.decorator';

@InputType()
export class RegisterUserInput {
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

  @Field()
  @IsOnlyDate()
  birthDay: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  homepage?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  image?: Promise<FileUpload>;
}

@InputType()
export class RegisterAdminInput extends OmitType(RegisterUserInput, [
  'bio',
  'fullname',
  'homepage',
  'birthDay',
]) {}
