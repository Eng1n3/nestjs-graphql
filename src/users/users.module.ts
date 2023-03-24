import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DateScalar } from 'src/common/scalars/date.scalar';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersResolver, DateScalar],
})
export class UsersModule {}
