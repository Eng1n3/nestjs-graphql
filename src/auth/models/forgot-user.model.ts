import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ForgotUserModel {
  @Field()
  email: string;
}
