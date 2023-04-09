import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Priority } from './entities/priority.entity';
import { ILike, Repository } from 'typeorm';
import {
  GetPrioritiesInput,
  SearchPrioritiesInput,
} from './dto/get-priority.input';

@Injectable()
export class PriorityService {
  constructor(
    @InjectRepository(Priority)
    private priorityRepository: Repository<Priority>,
  ) {}

  async count(searchPrioritiesInput?: SearchPrioritiesInput) {
    try {
      const result = await this.priorityRepository.count({
        where: {
          name: ILike(`%${searchPrioritiesInput?.name || ''}%`),
          description: ILike(`%${searchPrioritiesInput?.description || ''}%`),
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findByIdPriority(idPriority: string) {
    const result = await this.priorityRepository.findOne({
      where: { idPriority },
    });
    return result;
  }

  async find(optionsInput?: GetPrioritiesInput<Priority>) {
    const order = optionsInput?.sort;
    const skip = optionsInput?.pagination?.skip;
    const take = optionsInput?.pagination?.take;
    const result = await this.priorityRepository.find({
      where: {
        name: ILike(`%${optionsInput?.search?.name || ''}%`),
        description: ILike(`%${optionsInput?.search?.description || ''}%`),
      },
      skip,
      take,
      order,
    });
    return result;
  }

  async create(name: string, description: string) {
    const result = this.priorityRepository.create({ name, description });
    await this.priorityRepository.save(result);
    return result;
  }

  async update(idPriority: string, name: string, description: string) {
    const result = this.priorityRepository.create({
      idPriority,
      name,
      description,
    });
    await this.priorityRepository.save(result);
    return result;
  }

  async delete(idPriority: string) {
    const { project, ...result } = await this.priorityRepository.findOne({
      where: { idPriority },
      relations: { project: true },
    });
    if (!result) throw new NotFoundException('Prioritas tidak ada!');
    if (project?.length)
      throw new BadRequestException(
        `Tidak bisa menghapus prioritas karena sedang digunakan`,
      );
    return result;
  }
}
