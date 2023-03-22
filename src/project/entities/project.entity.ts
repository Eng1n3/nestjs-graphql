import { Field, ObjectType } from '@nestjs/graphql';
import { DocumentEntity } from 'src/document/entities/document.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Project {
  @ManyToMany((type) => User, (user) => user.idUser, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({ name: 'idUser' })
  @Field()
  idUser: string;

  @PrimaryGeneratedColumn('uuid')
  @Field()
  idProject: string;

  @Column()
  @Field()
  projectName: string;

  @Column({ type: 'text' })
  @Field()
  description: string;

  @CreateDateColumn({ type: 'time with time zone' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'time with time zone' })
  @Field()
  updatedAt: Date;

  @ManyToOne((type) => DocumentEntity, (doc) => doc.idProject)
  @Field(() => [DocumentEntity], { nullable: true, defaultValue: [] })
  document?: DocumentEntity[];
}
