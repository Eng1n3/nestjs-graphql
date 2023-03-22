import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Project } from './entities/project.entity';

@Resolver(() => Project)
export class ProjectResolver {
  @Mutation(() => String)
  async createProject() {
    try {
      return 'Success create user';
    } catch (error) {
      throw error;
    }
  }

  @Query(() => String)
  async project() {
    try {
      return 'Oke';
    } catch (error) {
      throw error;
    }
  }
}
