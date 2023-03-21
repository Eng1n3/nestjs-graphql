import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  idUser: string;

  @Column({ unique: true, length: 50 })
  @Field()
  username: string;

  @Column({ unique: true, length: 100 })
  @Field()
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 100 })
  @Field()
  fullname: string;

  @Column({ length: 100 })
  @Field()
  pathImage: string;

  @Column({ type: 'text', nullable: true })
  @Field()
  bio?: string;

  @Column({ nullable: true, length: 100 })
  @Field()
  homepage?: string;

  @CreateDateColumn({ type: 'time with time zone' })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ type: 'time with time zone' })
  @Field(() => Date)
  updatedAt: Date;
}
