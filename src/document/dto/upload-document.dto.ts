import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class UploadDocumentInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  idProject: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  documentName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => GraphQLUpload)
  @IsNotEmpty()
  file: FileUpload;
}
