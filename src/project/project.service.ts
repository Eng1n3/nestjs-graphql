import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { ILike, Repository } from 'typeorm';
import { CreateProjectInput } from './dto/create-project.input';
import { GetProjectsInput } from './dto/get-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/project.entity';
import { v4 as uuid4 } from 'uuid';
import { Priority } from 'src/priority/entities/priority.entity';
import * as moment from 'moment';
import { isEmpty } from 'class-validator';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
  ) {}

  private _countProjectByDate(dataMonth: any[], dataMonthUser: any[]) {
    const result = dataMonth.map((month) => {
      const resultDataMonth = dataMonthUser.find(
        (monthUser: { date: string; count: number }) =>
          month.date === monthUser.date,
      );
      if (resultDataMonth) {
        return {
          date: moment(new Date(resultDataMonth.date)).format('MMM YY'),
          count: +resultDataMonth.count,
        };
      } else {
        return {
          date: moment(new Date(month.date)).format('MMM YY'),
          count: +month.count,
        };
      }
    });
    return result;
  }

  private _dataMonth(year: number) {
    const months: any[] = [];
    for (let i = 1; i <= 12; i++) {
      const month = i.toString().length === 1 ? `0${i}` : i;
      months.push({ date: `${year}-${month}`, count: 0 });
    }
    return months;
  }

  async yearProject(idUser: string | null, limit: number) {
    const yearUser = await this.projectRepository.findOne({
      select: { idProject: true, createdAt: true },
      where: { user: { idUser } },
      order: { createdAt: 'ASC' },
    });
    if (!yearUser) return [];
    let year: number = new Date(yearUser.createdAt).getFullYear();
    const result: any[] = [];
    for (let i = 0; i < limit; i++) {
      if (i > 0) {
        year += 1;
        result.push({ id: year, year });
      } else result.push({ id: year, year });
    }
    return result;
  }

  async countProjectByDate(idUser: string | null, year: number) {
    const dataProjectUser = this.projectRepository
      .createQueryBuilder()
      .select([`to_char("createdAt", 'YYYY-MM') AS date`, `count(*) AS count`])
      .where(`"idUser" = :idUser`, { idUser })
      .groupBy('date')
      .having(
        `to_char("createdAt", 'YYYY-MM') BETWEEN :startYear AND :endYear`,
        { startYear: `${year}-01-01`, endYear: `${year}-12-31` },
      );

    const months = this._dataMonth(year);
    const monthsUser = await dataProjectUser.execute();
    const result = this._countProjectByDate(months, monthsUser);
    return result;
  }

  async findByIdUser(idUser: string): Promise<Project[]> {
    const result = await this.projectRepository.find({
      where: { user: { idUser } },
      relations: {
        user: true,
        priority: true,
        document: true,
      },
    });
    return result;
  }

  async projectCount(idUser: string | null, searchProjectInput?: string) {
    const filter = { user: { idUser } };
    const result = await this.projectRepository.count({
      where: [
        {
          projectName: ILike(`%${searchProjectInput || ''}%`),
          ...filter,
        },
        {
          description: ILike(`%${searchProjectInput || ''}%`),
          ...filter,
        },
      ],
    });
    return result;
  }

  async updateByIdProject(
    idUser?: string,
    priority?: Priority,
    updateProjectInput?: UpdateProjectInput,
  ) {
    const { idProject, ...project } = updateProjectInput;
    const existProject = await this.projectRepository.findOne({
      where: {
        user: { idUser },
        idProject: updateProjectInput?.idProject,
      },
      relations: {
        user: true,
        priority: true,
        document: true,
      },
    });
    if (isEmpty(existProject))
      throw new BadRequestException('Project tidak ditemukan!');
    const value = this.projectRepository.create({
      idProject,
      priority,
      ...project,
    });
    await this.projectRepository.update(idProject, value);
    const result = { ...existProject, ...value };
    return result;
  }

  async findByIdProject(idProject: string) {
    const result = await this.projectRepository.findOne({
      where: { idProject },
      relations: {
        user: true,
        priority: true,
        document: true,
      },
    });
    return result;
  }

  async deleteProject(idProject: string) {
    await this.projectRepository.delete(idProject);
  }

  async findAll(
    idUser?: string | null,
    getProjectsInput?: GetProjectsInput<Project>,
  ) {
    const order = getProjectsInput?.sort;
    const skip = getProjectsInput?.pagination?.skip;
    const take = getProjectsInput?.pagination?.take;
    const filter = { user: { idUser, role: 'user' } };
    const result = await this.projectRepository.find({
      where: [
        {
          projectName: ILike(`%${getProjectsInput?.search || ''}%`),
          ...filter,
        },
        {
          description: ILike(`%${getProjectsInput?.search || ''}%`),
          ...filter,
        },
        {
          priority: {
            name: getProjectsInput?.search
              ? ILike(`%${getProjectsInput?.search || ''}%`)
              : null,
          },
          ...filter,
        },
      ],
      relations: {
        user: true,
        document: true,
        priority: true,
      },
      skip,
      take,
      order,
    });
    return result;
  }

  async create(
    idUser?: string,
    createProjectModel?: CreateProjectInput,
    idPriority?: string,
  ): Promise<Project | any> {
    const projectInput = createProjectModel;
    const value = this.projectRepository.create({
      user: { idUser },
      idProject: uuid4(),
      ...projectInput,
      priority: { idPriority },
    });
    await this.projectRepository.save(value);
    mkdirSync(join(process.cwd(), '/uploads/projects/', value.idProject), {
      recursive: true,
    });
    const result = await this.projectRepository.findOne({
      where: { idProject: value.idProject },
      relations: {
        user: true,
        document: true,
        priority: true,
      },
    });
    return result;
  }
}
