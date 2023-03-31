import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { ILike, Repository } from 'typeorm';
import { CreateProjectInput } from './dto/create-project.input';
import { GetProjectsInput, SearchProjectInput } from './dto/get-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/project.entity';
import { v4 as uuid4 } from 'uuid';
import { User } from 'src/users/entities/user.entity';

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

  async projectAdminCount(
    idUser: string,
    searchProjectInput: SearchProjectInput,
  ) {
    try {
      const result = await this.projectRepository.count({
        where: {
          projectName: ILike(`%${searchProjectInput?.projectName || ''}%`),
          description: ILike(`%${searchProjectInput?.description || ''}%`),
        },
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
          idProject: ILike(`%${searchProjectInput?.idProject || ''}%`),
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

  async findAll(
    idUser: string | null,
    getProjectsInput?: GetProjectsInput<Project>,
  ) {
    try {
      const order = getProjectsInput?.sort;
      const skip = getProjectsInput?.pagination?.skip;
      const take = getProjectsInput?.pagination?.take;
      const result = await this.projectRepository.find({
        where: {
          user: { idUser },
          idProject: ILike(`%${getProjectsInput?.search?.idProject || ''}%`),
          projectName: ILike(
            `%${getProjectsInput?.search?.projectName || ''}%`,
          ),
          description: ILike(
            `%${getProjectsInput?.search?.description || ''}%`,
          ),
        },
        relations: {
          user: true,
          document: true,
        },
        skip,
        take,
        order,
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
        idProject: uuid4(),
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
