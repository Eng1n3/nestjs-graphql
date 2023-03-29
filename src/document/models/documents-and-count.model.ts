import { Field, ObjectType, OmitType, PartialType } from '@nestjs/graphql';
import { CountModel } from 'src/common/models/count.model';
import { DocumentEntity } from '../entities/document.entity';

@ObjectType()
export class DocumentsAndCountModel extends PartialType(CountModel) {
  @Field((types) => [DocumentEntity])
  data: Array<DocumentEntity>;
}
