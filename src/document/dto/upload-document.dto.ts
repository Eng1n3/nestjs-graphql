import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class UploadDocumentInput {
  @Field()
  @IsString()
  documentName: string;

  @Field()
  @IsString()
  documentDescription: string;

  @Field(() => GraphQLUpload)
  @IsNotEmpty()
  document: Promise<FileUpload>;
}
