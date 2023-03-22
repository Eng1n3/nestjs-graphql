import { Field, ObjectType } from '@nestjs/graphql';
import { Project } from 'src/project/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'document' })
@ObjectType()
export class DocumentEntity {
  @OneToOne((type) => Project, (project) => project.idProject, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({ name: 'idProject' })
  @Field(() => Project)
  idProject: string;

  @PrimaryGeneratedColumn('uuid')
  @Field()
  idDocument: string;

  @Column({ length: 50 })
  documentName: string;

  @Column({ length: 100 })
  pathDocument: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn({ type: 'time with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'time with time zone' })
  updatedAt: Date;
}
