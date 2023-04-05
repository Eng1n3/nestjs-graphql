import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { UploadDocumentInput } from './upload-document.dto';

@InputType()
export class UpdateDocumentInput extends PartialType(
  OmitType(UploadDocumentInput, ['idProject']),
) {
  @Field()
  @IsString()
  @IsNotEmpty()
  idDocument: string;
}
