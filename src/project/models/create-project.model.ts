import { Field, ObjectType, PartialType } from '@nestjs/graphql';
import { CreateProjectInput } from '../dto/create-project.input';

@ObjectType()
export class CreateProjectModel extends PartialType(CreateProjectInput) {
  @Field()
  idUser: string;
}
