import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { RegisterAdminInput, RegisterUserInput } from './register.input';

@InputType()
export class UpdateUserInput extends PartialType(RegisterUserInput) {
  @Field((types) => GraphQLUpload, { nullable: true })
  @IsOptional()
  image?: FileUpload;
}

@InputType()
export class UpdateAdminInput extends PartialType(RegisterAdminInput) {
  @Field((types) => GraphQLUpload, { nullable: true })
  @IsOptional()
  image?: FileUpload;
}
