import { Field, ObjectType } from '@nestjs/graphql';
import { DocumentEntity } from 'src/document/entities/document.entity';
import { User } from 'src/users/entities/user.entity';
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
@ObjectType()
export class Project {
  @OneToOne((type) => User, (user) => user.idUser, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'idUser' })
  idUser?: string;

  @PrimaryGeneratedColumn('uuid')
  @Field()
  idProject: string;

  @Column({ unique: true })
  @Field()
  projectName: string;

  @Column({ type: 'text' })
  @Field()
  description: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @Field()
  updatedAt: Date;

  @OneToOne((type) => DocumentEntity, (doc) => doc.idProject)
  @Field(() => [DocumentEntity], { nullable: true, defaultValue: [] })
  document?: DocumentEntity[];
}
