import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { UploadDocumentInput } from './upload-document.dto';

@InputType()
export class UpdateDocumentInput extends PartialType(
  OmitType(UploadDocumentInput, ['documentName'] as const),
) {}
