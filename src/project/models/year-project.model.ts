import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class YearProjectModel {
  @Field((returns) => Int, { description: 'uuid untuk id year' })
  id: number;

  @Field((returns) => Int, { description: 'Tahun pembuatan project' })
  year: number;
}
