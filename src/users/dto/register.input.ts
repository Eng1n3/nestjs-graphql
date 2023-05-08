import { Field, InputType, OmitType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinDate,
} from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { IsBirthdayDate } from 'src/common/decorators/birthday-date.decorator';
import { IsHomepage } from 'src/common/decorators/is-homepage.decorator';
import { IsOnlyDate } from 'src/common/decorators/is-only-date.decorator';
import { Match } from 'src/common/decorators/match.decorator';

@InputType()
export class RegisterUserInput {
  @Field({ description: 'email user, contoh: "email@gmail.com"' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field({ description: 'password user, contoh: "Sup3r_setrong_paswot"' })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @Field({ description: 'nilai harus sama dengan password' })
  @IsString()
  @IsNotEmpty()
  @Match('password', { message: 'repassword harus sama dengan password' })
  repassword: string;

  @Field({ description: 'nama lengkap user, contoh: "nama lengkap user"' })
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @Field({
    description:
      'tanggal lahir user berupa nilai tanggal, contoh: "2002-03-23"',
  })
  @IsBirthdayDate()
  @IsOnlyDate()
  birthDay: string;

  @Field({
    nullable: true,
    description: 'bio user, contoh: "bio user"',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field({
    nullable: true,
    description: 'homepage user, contoh: "https://domain.com/home"',
  })
  @IsOptional()
  @IsHomepage()
  homepage?: string;

  @Field(() => GraphQLUpload, {
    nullable: true,
    description: 'image user, upload file berupa image',
  })
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
