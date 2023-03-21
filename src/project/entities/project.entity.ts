import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Project {
  @ManyToOne((type) => User, (user) => user.idUser, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({ name: 'idUser' })
  idUser: string;

  @PrimaryGeneratedColumn('uuid')
  idProject: string;

  @Column()
  projectName: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn({ type: 'time with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'time with time zone' })
  updatedAt: Date;
}