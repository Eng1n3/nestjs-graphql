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
  @Field(() => User, {
    description: 'user bedasarkan project contoh: {...user}',
  })
  user?: User;

  @PrimaryColumn()
  @Field({
    description:
      'id project berupa uuid, contoh: "0900ec8d-a3e3-46d0-ac9f-288acbdd0ew"',
  })
  idProject: string;

  @Column()
  @Field({ description: 'nama project, contoh: "nama project"' })
  projectName: string;

  @Column({ type: 'text' })
  @Field({ description: 'deskripsi project, contoh: "deskripsi project"' })
  description: string;

  @ManyToOne((type) => Priority, (priority) => priority.idPriority, {
    nullable: true,
  })
  @JoinColumn({ name: 'priority' })
  @Field(() => Priority, {
    nullable: true,
    defaultValue: null,
    description: 'prioritas bedasarkan project contoh: {...priority}',
  })
  priority?: Priority;

  @Column({ type: 'timestamp with time zone' })
  @Field({
    description: 'dead line project berupa tanggal, contoh: "2002-03-23"',
  })
  deadLine: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field({
    description: 'tanggal dibuatnya data berupa tanggal, contoh: "2002-03-23"',
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @Field({
    description: 'update dibuatnya data berupa tanggal, contoh: "2002-03-23"',
  })
  updatedAt: Date;

  @OneToMany((type) => DocumentEntity, (doc) => doc.project)
  @Field(() => [DocumentEntity], {
    nullable: true,
    defaultValue: [],
    description: 'dokumen bedasarkan project contoh: [{...document}]',
  })
  document?: DocumentEntity[];
}
