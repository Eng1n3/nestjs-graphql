import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectModel } from './models/create-project.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
  ) {}

  // async deleteProject() {}

  async findByUser(idUser: string): Promise<Project[]> {
    try {
      const result = await this.projectRepository.find({
        where: { idUser },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async create(createProjectModel: CreateProjectModel): Promise<Project | any> {
    try {
      const value = await this.projectRepository.create(createProjectModel);
      await this.projectRepository.save(value);
      mkdirSync(join(process.cwd(), '/uploads/projects/', value.idProject));
      return value;
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
