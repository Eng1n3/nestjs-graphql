import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/project.entity';
import { CreateProjectModel } from './models/create-project.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
  ) {}

  async updateByIdProject(
    idUser: string,
    updateProjectInput: UpdateProjectInput,
  ) {
    try {
      const { idProject, ...value } = updateProjectInput;
      await this.projectRepository.update(idProject, value);
    } catch (error) {
      throw error;
    }
  }

  async findByIdProject(idProject: string) {
    try {
      const result = await this.projectRepository.findOne({
        where: { idProject },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteProject(idProject: string) {
    try {
      await this.projectRepository.delete(idProject);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Project[]> {
    try {
      const result = await this.projectRepository.find();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findByUser(idUser: string): Promise<Project[]> {
    try {
      const result = await this.projectRepository.find({
        where: { user: { idUser } },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async create(
    idUser: string,
    createProjectModel: CreateProjectInput,
  ): Promise<Project | any> {
    try {
      const value = this.projectRepository.create({
        user: { idUser },
        ...createProjectModel,
      });
      await this.projectRepository.save(value);
      mkdirSync(join(process.cwd(), '/uploads/projects/', value.idProject), {
        recursive: true,
      });
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
