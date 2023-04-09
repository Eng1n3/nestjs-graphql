import { forwardRef, Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UsersModule } from 'src/users/users.module';
import { DocumentModule } from 'src/document/document.module';
import { PriorityModule } from 'src/priority/priority.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    forwardRef(() => UsersModule),
    forwardRef(() => DocumentModule),
    forwardRef(() => PriorityModule),
  ],
  providers: [ProjectService, ProjectResolver],
  exports: [ProjectService],
})
export class ProjectModule {}
