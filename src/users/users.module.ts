import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DateScalar } from 'src/common/scalars/date.scalar';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ProjectModule],
  providers: [UsersService, UsersResolver, DateScalar],
  exports: [UsersService],
})
export class UsersModule {}
