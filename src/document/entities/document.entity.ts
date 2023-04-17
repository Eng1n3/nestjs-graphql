import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { Project } from 'src/project/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'document' })
@ObjectType()
export class DocumentEntity {
  @ManyToOne((type) => Project, (project) => project.idProject, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'idProject' })
  @Field(() => Project, {
    description: 'Project bedasarkan dokumen contoh: {...project}',
  })
  project: Project;

  @PrimaryColumn()
  @Field({
    description:
      'id dokumen berupa uuid, contoh: "0900ec8d-a3e3-46d0-ac9f-288acbdd0ew"',
  })
  idDocument: string;

  @Column({ length: 50 })
  @Field({
    description: 'Nama untuk document, contoh: "Ini adalah nama dokumen"',
  })
  documentName: string;

  @Column({ type: 'text' })
  @Directive('@backendUrl')
  @Field({
    description:
      'path dokumen, contoh: "http://domain.com/uploads/sodjo-dsbdib-sndd-ndni/ahsah-323innd-2839-mod-file.pdf"',
  })
  pathDocument: string;

  @Column({ type: 'text' })
  @Field({
    description: 'deskripsi data dokument, contoh: "ini adalah deskripsi"',
  })
  description: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field({
    description: 'tanggal dibuatnya data berupa tanggal, contoh: "2002-03-23"',
  })
  createdAt: Date;

  @Field({
    description: 'update dibuatnya data berupa tanggal, contoh: "2002-03-23"',
  })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
