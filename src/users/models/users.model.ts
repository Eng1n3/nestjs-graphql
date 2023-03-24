import { Field, ObjectType, PartialType } from '@nestjs/graphql';
import { CountModel } from 'src/common/models/count.model';
import { User } from '../entities/user.entity';

@ObjectType()
export class UsersModel extends PartialType(CountModel) {
  @Field((returns) => [User])
  data: Array<User>;
}
