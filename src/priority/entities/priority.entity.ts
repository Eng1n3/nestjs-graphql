import { Field, ObjectType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { capitalizeFirstLetter } from 'src/common/functions/capitalize-first-letter.function';
import { Project } from 'src/project/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Priority {
  @PrimaryColumn()
  @Field()
  idPriority: string;

  @Column({ unique: true })
  @Field()
  @Transform(({ value }) => `${capitalizeFirstLetter(value)}`)
  name: string;

  @Column({ type: 'text' })
  @Field()
  description: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @Field()
  updatedAt: Date;

  @OneToMany((type) => Project, (project) => project.priority)
  @Field(() => [Project], { nullable: true, defaultValue: [] })
  project?: Project[];
}
