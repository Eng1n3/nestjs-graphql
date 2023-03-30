import { Field, ObjectType } from '@nestjs/graphql';
import { Project } from 'src/project/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'document' })
@ObjectType()
export class DocumentEntity {
  @ManyToOne((type) => Project, (project) => project.idProject, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'idProject' })
  @Field(() => Project)
  project: Project;

  @PrimaryColumn()
  @Field()
  idDocument: string;

  @Column({ length: 50 })
  @Field()
  documentName: string;

  @Column({ type: 'text' })
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
