import { Module } from '@nestjs/common';
import { PriorityResolver } from './priority.resolver';
import { PriorityService } from './priority.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Priority } from './entities/priority.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Priority])],
  providers: [PriorityResolver, PriorityService],
})
export class PriorityModule {}
