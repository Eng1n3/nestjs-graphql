import { Field, ObjectType } from '@nestjs/graphql';
import { Project } from 'src/project/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  idUser: string;

  @Column({ length: 50, unique: true })
  @Field()
  username: string;

  @Column({ length: 100, unique: true })
  @Field()
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 100 })
  @Field()
  fullname: string;

  @Column({ length: 100 })
  @Field()
  pathImage: string;

  @Column({ length: 50 })
  @Field()
  role: string;

  @Column({ type: 'text', nullable: true })
  @Field()
  bio?: string;

  @Column({ nullable: true, length: 100 })
  @Field()
  homepage?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @Field(() => Date)
  updatedAt: Date;

  @ManyToMany(() => Project, (project) => project.idUser)
  @Field(() => [Project], { nullable: true, defaultValue: [] })
  project?: Project[];
}
