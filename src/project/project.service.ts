import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { CreateProjectModel } from './models/create-project.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
  ) {}

  async userFind(idUser: string): Promise<Project[]> {
    try {
      const result = await this.projectRepository.find({
        where: { idUser },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async create(CreateProjectModel: CreateProjectModel): Promise<void | any> {
    try {
      await this.projectRepository.save(CreateProjectModel);
    } catch (error) {
      if (
        error.message.includes('duplicate key value') &&
        error?.detail?.includes('projectName')
      ) {
        throw new BadRequestException('project name has been used!');
      }
      throw error;
    }
  }
}
