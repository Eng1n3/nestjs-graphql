import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Priority } from './entities/priority.entity';
import { Equal, ILike, Repository } from 'typeorm';
import { GetPrioritiesInput } from './dto/get-priority.input';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PriorityService {
  constructor(
    @InjectRepository(Priority)
    private priorityRepository: Repository<Priority>,
  ) {}

  async count(searchPrioritiesInput?: string) {
    try {
      const result = await this.priorityRepository.count({
        where: [
          {
            name: ILike(`%${searchPrioritiesInput || ''}%`),
          },
          {
            description: ILike(`%${searchPrioritiesInput || ''}%`),
          },
        ],
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findOneByIdPriority(idPriority: string | null) {
    const result = await this.priorityRepository.findOneBy({
      idPriority: Equal(idPriority),
    });
    return result;
  }

  async find(optionsInput?: GetPrioritiesInput<Priority>) {
    const order = optionsInput?.sort;
    const skip = optionsInput?.pagination?.skip;
    const take = optionsInput?.pagination?.take;
    const result = await this.priorityRepository.find({
      where: [
        {
          name: ILike(`%${optionsInput?.search || ''}%`),
        },
        {
          description: ILike(`%${optionsInput?.search || ''}%`),
        },
      ],
      skip,
      take,
      order,
    });
    return result;
  }

  async create(name: string, description: string) {
    const idPriority = uuidv4();
    const result = this.priorityRepository.create({
      idPriority,
      name,
      description,
    });
    await this.priorityRepository.save(result);
    return result;
  }

  async update(idPriority: string, name?: string, description?: string) {
    const { project, ...result } = await this.priorityRepository.findOne({
      where: { idPriority },
      relations: { project: true },
    });
    if (!result) throw new NotFoundException('Prioritas tidak ada!');
    const value = this.priorityRepository.create({
      name,
      description,
    });
    await this.priorityRepository.update(idPriority, value);
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
    await this.priorityRepository.delete(idPriority);
    return result;
  }
}
