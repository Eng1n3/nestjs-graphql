import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class UploadDocumentInput {
  @Field({
    description:
      'id project berupa uuid, contoh: "0900ec8d-a3e3-46d0-ac9f-288acbdd0ew"',
  })
  @IsString()
  @IsNotEmpty()
  idProject: string;

  @Field({
    description: 'Nama untuk document, contoh: "Ini adalah nama dokumen"',
  })
  @IsString()
  @IsNotEmpty()
  documentName: string;

  @Field({
    nullable: true,
    description: 'deskripsi data dokument, contoh: "ini adalah deskripsi"',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => GraphQLUpload, {
    description: 'File untuk project',
  })
  @IsNotEmpty()
  file: Promise<FileUpload>;
}
