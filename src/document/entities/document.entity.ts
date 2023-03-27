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
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'idProject' })
  idProject: string;

  @PrimaryGeneratedColumn('uuid')
  @Field()
  idDocument: string;

  @Column({ length: 50, unique: true })
  @Field()
  documentName: string;

  @Column({ length: 100 })
  @Field()
  pathDocument: string;

  @Column({ type: 'text' })
  @Field()
  description: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
