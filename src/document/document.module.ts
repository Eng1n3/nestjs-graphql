import { forwardRef, Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentResolver } from './document.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { ProjectModule } from 'src/project/project.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([DocumentEntity]),
    forwardRef(() => ProjectModule),
  ],
  providers: [DocumentService, DocumentResolver],
  exports: [DocumentService],
})
export class DocumentModule {}
