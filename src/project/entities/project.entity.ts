import { Field, ObjectType } from '@nestjs/graphql';
import { DocumentEntity } from 'src/document/entities/document.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Project {
  @ManyToOne((type) => User, (user) => user.idUser, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'idUser' })
  @Field(() => User)
  user?: User;

  @PrimaryColumn()
  idProject: string;

  @Column()
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

  @OneToMany((type) => DocumentEntity, (doc) => doc.project)
  @Field(() => [DocumentEntity], { nullable: true, defaultValue: [] })
  document?: DocumentEntity[];
}
