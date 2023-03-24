import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CountModel {
  @Field((returns) => Int)
  count: number;
}
