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
  @Field({
    description:
      'id prioritas berupa uuid, contoh: "0900ec8d-a3e3-46d0-ac9f-288acbdd0ew"',
  })
  idPriority: string;

  @Column({ unique: true })
  @Field({ description: 'nama untuk prioritas, contoh: "nama prioritas"' })
  @Transform(({ value }) => `${capitalizeFirstLetter(value)}`)
  name: string;

  @Column({ type: 'text' })
  @Field({
    description: 'deskripsi untuk prioritas, contoh: "deskripsi prioritas"',
  })
  description: string;

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

  @OneToMany((type) => Project, (project) => project.priority)
  project?: Project[];
}
