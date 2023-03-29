import { Field, ObjectType, PartialType } from '@nestjs/graphql';
import { CountModel } from 'src/common/models/count.model';
import { Project } from '../entities/project.entity';

@ObjectType()
export class ProjectsAndCountModel extends PartialType(CountModel) {
  @Field((types) => [Project])
  data: Array<Project>;
}
