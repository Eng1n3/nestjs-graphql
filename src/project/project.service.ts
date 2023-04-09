/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { ILike, Repository } from 'typeorm';
import { CreateProjectInput } from './dto/create-project.input';
import { GetProjectsInput, SearchProjectInput } from './dto/get-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/project.entity';
import { v4 as uuid4 } from 'uuid';
import { plainToInstance } from 'class-transformer';
import { Priority } from 'src/priority/entities/priority.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
  ) {}

  async findByIdUser(idUser: string): Promise<Project[]> {
    try {
      const result = await this.projectRepository.find({
        where: { user: { idUser } },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async projectCount(
    idUser: string | null,
    searchProjectInput?: SearchProjectInput,
  ) {
    try {
      const result = await this.projectRepository.count({
        where: {
          user: { idUser },
          projectName: ILike(`%${searchProjectInput?.projectName || ''}%`),
          description: ILike(`%${searchProjectInput?.description || ''}%`),
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateByIdProject(
    idUser?: string,
    priority?: Priority,
    updateProjectInput?: UpdateProjectInput,
  ) {
    try {
      const { idProject, ...project } = updateProjectInput;
      const existProject = await this.projectRepository.findOne({
        where: {
          user: { idUser },
          idProject: updateProjectInput?.idProject,
        },
      });
      if (!existProject) throw new NotFoundException('Project not found!');
      const value = this.projectRepository.create({
        idProject,
        priority,
        ...project,
      });
      await this.projectRepository.update(idProject, value);
      const result = plainToInstance(Project, { ...existProject, ...value });
      return result;
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

  async findAll(
    idUser?: string | null,
    getProjectsInput?: GetProjectsInput<Project>,
  ) {
    try {
      const order = getProjectsInput?.sort;
      const skip = getProjectsInput?.pagination?.skip;
      const take = getProjectsInput?.pagination?.take;
      const project = await this.projectRepository.find({
        where: {
          user: { idUser, role: 'user' },
          projectName: ILike(
            `%${getProjectsInput?.search?.projectName || ''}%`,
          ),
          description: ILike(
            `%${getProjectsInput?.search?.description || ''}%`,
          ),
          priority: {
            name: getProjectsInput?.search?.priority
              ? ILike(`%${getProjectsInput?.search?.priority || ''}%`)
              : null,
          },
        },
        relations: {
          user: true,
          document: true,
          priority: true,
        },
        skip,
        take,
        order,
      });
      const result = plainToInstance(Project, project);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async create(
    idUser?: string,
    createProjectModel?: CreateProjectInput,
  ): Promise<Project | any> {
    try {
      const { idPriority, ...projectInput } = createProjectModel;
      const value = this.projectRepository.create({
        user: { idUser },
        priority: { idPriority },
        idProject: uuid4(),
        ...projectInput,
      });
      await this.projectRepository.save(value);
      mkdirSync(join(process.cwd(), '/uploads/projects/', value.idProject), {
        recursive: true,
      });
      return value;
    } catch (error) {
      throw error;
    }
  }
}
