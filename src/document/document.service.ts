/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createWriteStream, rmSync } from 'fs';
import { FileUpload } from 'graphql-upload';
import { join } from 'path';
import { ILike, Repository } from 'typeorm';
import { GetDocumentsInput } from './dto/get-documents.input';
import { UpdateDocumentInput } from './dto/update-document.dto';
import { UploadDocumentInput } from './dto/upload-document.dto';
import { DocumentEntity } from './entities/document.entity';
import { v4 as uuid4 } from 'uuid';
import { isEmpty } from 'class-validator';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity)
    private documentRepository: Repository<DocumentEntity>,
  ) {}

  async countDocument(
    idUser: string | null,
    idProject: string | null,
    searchDocumentsInput: string,
  ) {
    const filter = {
      project: {
        user: { idUser },
        idProject,
      },
    };
    const result = await this.documentRepository.count({
      where: [
        {
          documentName: ILike(`%${searchDocumentsInput || ''}%`),
          ...filter,
        },
        {
          description: ILike(`%${searchDocumentsInput || ''}%`),
          ...filter,
        },
        {
          pathDocument: ILike(`%${searchDocumentsInput || ''}%`),
          ...filter,
        },
      ],
    });
    return result;
  }

  async updateDocument(
    idUser: string,
    updateDocumentInput: UpdateDocumentInput,
  ) {
    let pathDocument: string;
    const document = await updateDocumentInput.file;
    const existDocument = await this.documentRepository.findOne({
      where: {
        project: { user: { idUser } },
        idDocument: updateDocumentInput.idDocument,
      },
      relations: {
        project: { user: true, priority: true },
      },
    });
    if (!existDocument)
      throw new BadRequestException('Dokumen tidak ditemukan!');
    const pathName = `/uploads/projects/${existDocument?.project?.idProject}`;
    if (document) {
      pathDocument = await this.saveDocumentToDir(document, pathName);
      rmSync(join(process.cwd(), existDocument.pathDocument), {
        recursive: true,
        force: true,
      });
    }
    const { idDocument, ...values } = updateDocumentInput;
    const value = this.documentRepository.create({
      idDocument,
      ...values,
      pathDocument,
    });
    await this.documentRepository.update(idDocument, value);
    const result = {
      ...existDocument,
      ...value,
    };
    return result;
  }

  async findAll(
    idUser?: string | null,
    idProject?: string | null,
    optionsInput?: GetDocumentsInput<DocumentEntity>,
  ) {
    const order = optionsInput?.sort;
    const skip = optionsInput?.pagination?.skip;
    const take = optionsInput?.pagination?.take;
    const filter = {
      project: {
        user: { idUser },
        idProject,
      },
    };
    const result = await this.documentRepository.find({
      where: [
        {
          documentName: ILike(`%${optionsInput?.search || ''}%`),
          ...filter,
        },
        {
          description: ILike(`%${optionsInput?.search || ''}%`),
          ...filter,
        },
        {
          pathDocument: ILike(`%${optionsInput?.search || ''}%`),
          ...filter,
        },
      ],
      relations: {
        project: { user: true, priority: true },
      },
      skip,
      take,
      order,
    });
    return result;
  }

  async getByIdProject(idProject: string) {
    const result = await this.documentRepository.find({
      where: { project: { idProject } },
      relations: {
        project: { user: true, priority: true },
      },
    });
    return result;
  }

  async deleteByIdProject(idProject: string) {
    await this.documentRepository.delete({ project: { idProject } });
  }

  async deleteById(idUser: string, idDocument: string) {
    const document = await this.documentRepository.findOne({
      where: { project: { user: { idUser } }, idDocument },
    });
    if (isEmpty(document)) throw new BadRequestException('Document not found!');
    rmSync(join(process.cwd(), document.pathDocument), {
      force: true,
      recursive: true,
    });
    await this.documentRepository.delete(idDocument);
    return document;
  }

  private saveDocumentToDir(
    document: FileUpload,
    pathName: string,
  ): Promise<string> {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const { createReadStream, filename } = document;
    const convertFilename = `${uniqueSuffix}-${filename?.replace(
      /([\s]+)/g,
      '-',
    )}`;
    return new Promise((resolve) => {
      createReadStream()
        .pipe(
          createWriteStream(
            join(process.cwd(), pathName, `${convertFilename}`),
          ),
        )
        .on('finish', () => resolve(`${pathName}/${convertFilename}`))
        .on('error', () => {
          new BadRequestException('Could not save image');
        });
    });
  }

  async createDocument(uploadDocumentInput: UploadDocumentInput) {
    const validImage = /(pdf)/g;
    const document = await uploadDocumentInput.file;
    if (!validImage.test(document.mimetype))
      throw new BadRequestException('File tidak valid!');
    const pathName = `/uploads/projects/${uploadDocumentInput.idProject}`;
    const pathDocumentToSave = await this.saveDocumentToDir(document, pathName);
    const value = this.documentRepository.create({
      project: { idProject: uploadDocumentInput.idProject },
      idDocument: uuid4(),
      ...uploadDocumentInput,
      pathDocument: pathDocumentToSave,
    });
    await this.documentRepository.save(value);
    const result = await this.documentRepository.findOne({
      where: { idDocument: value.idDocument },
      relations: { project: { user: true, priority: true } },
    });
    return result;
  }
}
