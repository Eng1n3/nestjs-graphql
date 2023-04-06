import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { Project } from 'src/project/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import '../../common/config/config.env';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

@Entity()
@ObjectType()
export class User {
  @PrimaryColumn()
  @Field()
  idUser: string;

  // @Column({ length: 50, unique: true })
  // @Field()
  // username: string;

  @Column({ length: 100, unique: true })
  @Field()
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 100, nullable: true })
  @Field({ nullable: true, defaultValue: '' })
  @IsOptional()
  fullname?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  @Field({ nullable: true, defaultValue: '' })
  @IsOptional()
  birthDay?: Date;

  @Column({ type: 'text' })
  @Transform(({ value }) => `${configService.get<string>('DOMAIN')}${value}`, {
    toClassOnly: true,
  })
  @Field()
  pathImage: string;

  @Column({ length: 50 })
  @Field()
  role: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true, defaultValue: '' })
  bio?: string;

  @Column({ nullable: true, length: 100 })
  @Field({ nullable: true, defaultValue: '' })
  homepage?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @Field(() => Date)
  updatedAt: Date;

  @OneToMany(() => Project, (project) => project.user)
  @Field(() => [Project], { nullable: true, defaultValue: [] })
  project?: Project[];
}
