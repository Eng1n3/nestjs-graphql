import { Project } from 'src/project/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Document {
  @PrimaryColumn()
  @ManyToMany((type) => Project, (project) => project.idProject, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({ name: 'idProject' })
  idUser: string;

  @PrimaryGeneratedColumn('uuid')
  idDocument: string;

  @Column()
  documentName: string;

  @Column()
  pathDocument: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
