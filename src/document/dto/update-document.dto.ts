import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { UploadDocumentInput } from './upload-document.dto';

@InputType()
export class UpdateDocumentInput extends PartialType(UploadDocumentInput) {
  @Field()
  @IsString()
  @IsNotEmpty()
  idDocument: string;
}
