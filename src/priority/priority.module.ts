import { Module, forwardRef } from '@nestjs/common';
import { PriorityResolver } from './priority.resolver';
import { PriorityService } from './priority.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Priority } from './entities/priority.entity';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Priority]),
    forwardRef(() => ProjectModule),
  ],
  providers: [PriorityResolver, PriorityService],
  exports: [PriorityService],
})
export class PriorityModule {}
