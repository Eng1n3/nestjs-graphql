import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryColumn()
  @ManyToMany((type) => User, (user) => user.idUser, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({ name: 'idUser' })
  idUser: string;

  @Column()
  fullname: string;

  @Column()
  pathImage: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ nullable: true })
  homepage?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
