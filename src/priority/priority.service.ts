import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Priority } from './entities/priority.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PriorityService {
  constructor(
    @InjectRepository(Priority)
    private priorityRepository: Repository<Priority>,
  ) {}

  async find() {
    const result = await this.priorityRepository.find();
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
    if (!result) throw new NotFoundException('Priority not found!');
    if (project?.length)
      throw new BadRequestException(
        `can't remove priority because it's in use`,
      );
    return result;
  }
}
