import { Field, ObjectType } from '@nestjs/graphql';
import { DocumentEntity } from 'src/document/entities/document.entity';
import { Priority } from 'src/priority/entities/priority.entity';
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
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'idUser' })
  @Field(() => User)
  user?: User;

  @PrimaryColumn()
  @Field()
  idProject: string;

  @Column()
  @Field()
  projectName: string;

  @Column({ type: 'text' })
  @Field()
  description: string;

  @ManyToOne((type) => Priority, (priority) => priority.idPriority, {
    nullable: true,
  })
  @JoinColumn({ name: 'priority' })
  @Field(() => Priority, { nullable: true, defaultValue: null })
  priority?: Priority;

  @Column({ type: 'timestamp with time zone' })
  @Field()
  deadLine: Date;

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
