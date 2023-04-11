import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { UploadDocumentInput } from './upload-document.dto';

@InputType()
export class UpdateDocumentInput extends PartialType(
  OmitType(UploadDocumentInput, ['idProject']),
) {
  @Field({
    description:
      'id document berupa uuid, contoh: "0900ec8d-a3e3-46d0-ac9f-288acbdd0ew"',
  })
  @IsString()
  @IsNotEmpty()
  idDocument: string;
}
