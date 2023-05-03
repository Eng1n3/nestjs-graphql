import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginModel {
  @Field()
  token: string;

  @Field()
  tokenRefresh: string;
}
