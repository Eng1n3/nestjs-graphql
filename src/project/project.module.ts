import { forwardRef, Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UsersModule } from 'src/users/users.module';
import { DocumentModule } from 'src/document/document.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    forwardRef(() => UsersModule),
    forwardRef(() => DocumentModule),
  ],
  providers: [ProjectService, ProjectResolver],
  exports: [ProjectService],
})
export class ProjectModule {}
