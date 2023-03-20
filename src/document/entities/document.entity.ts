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

@Entity()
export class Document {
  @OneToOne((type) => Project, (project) => project.idProject, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({ name: 'idProject' })
  idProject: string;

  @PrimaryGeneratedColumn('uuid')
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
