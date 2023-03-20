import { User } from 'src/users/entities/user.entity';
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
export class Project {
  @PrimaryColumn()
  @ManyToMany((type) => User, (user) => user.idUser, {
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
