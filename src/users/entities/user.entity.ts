import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { Project } from 'src/project/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

@Entity()
@ObjectType()
export class User {
  @PrimaryColumn()
  @Field({
    description:
      'id user berupa uuid, contoh: "0900ec8d-a3e3-46d0-ac9f-288acbdd0ew"',
  })
  idUser: string;

  // @Column({ length: 50, unique: true })
  // @Field()
  // username: string;

  @Column({ length: 100, unique: true })
  @Field({ description: 'email user, contoh: "email@gmail.com"' })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 100, nullable: true })
  @Field({
    nullable: true,
    defaultValue: '',
    description: 'nama lengkap user, contoh: "nama lengkap user"',
  })
  @IsOptional()
  fullname?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  @Field({
    nullable: true,
    defaultValue: '',
    description:
      'tanggal lahir user berupa nilai tanggal, contoh: "2002-03-23"',
  })
  @IsOptional()
  birthDay?: Date;

  @Column({ type: 'text' })
  @Transform(({ value }) => `${configService.get<string>('DOMAIN')}${value}`, {
    toClassOnly: true,
  })
  @Directive('@backendUrl')
  @Field({
    description:
      'path image, contoh: "/uploads/sodjo-dsbdib-sndd-ndni/ahsah-323innd-2839-mod-file.jpg"',
  })
  pathImage: string;

  @Column({ length: 50 })
  @Field({
    description: 'role user, contoh: "user"',
  })
  role: string;

  @Column({ type: 'text', nullable: true })
  @Field({
    nullable: true,
    defaultValue: '',
    description: 'bio user, contoh: "bio user"',
  })
  bio?: string;

  @Column({ nullable: true, length: 100 })
  @Field({
    nullable: true,
    defaultValue: '',
    description: 'homepage user, contoh: "https://domain.com/home"',
  })
  homepage?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field(() => Date, {
    description: 'tanggal dibuatnya data berupa tanggal, contoh: "2002-03-23"',
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @Field(() => Date, {
    description: 'update dibuatnya data berupa tanggal, contoh: "2002-03-23"',
  })
  updatedAt: Date;

  @OneToMany(() => Project, (project) => project.user)
  @Field(() => [Project], {
    nullable: true,
    defaultValue: [],
    description: 'Project bedasarkan user contoh: [{...project}]',
  })
  project?: Project[];
}
