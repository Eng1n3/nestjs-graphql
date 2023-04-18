/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadGatewayException,
  ClassSerializerInterceptor,
  Injectable,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createWriteStream, rmSync } from 'fs';
import { FileUpload } from 'graphql-upload-ts';
import { join } from 'path';
import { ILike, In, Repository } from 'typeorm';
import { GetDocumentsInput } from './dto/get-documents.input';
import { UpdateDocumentInput } from './dto/update-document.dto';
import { UploadDocumentInput } from './dto/upload-document.dto';
import { DocumentEntity } from './entities/document.entity';
import { v4 as uuid4 } from 'uuid';

@UseInterceptors(ClassSerializerInterceptor)
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
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async updateDocument(
    idUser: string,
    updateDocumentInput: UpdateDocumentInput,
  ) {
    try {
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
        throw new NotFoundException('Dokumen tidak ditemukan!');
      const pathName = `/uploads/projects/${existDocument?.project?.idProject}`;
      const pathDocumentToSave = await this.saveDocumentToDir(
        document,
        pathName,
      );
      const { idDocument, file, ...values } = updateDocumentInput;
      const value = this.documentRepository.create({
        idDocument,
        ...values,
        pathDocument: pathDocumentToSave,
      });
      await this.documentRepository.update(idDocument, value);
      rmSync(join(process.cwd(), existDocument.pathDocument));
      const result = {
        ...existDocument,
        ...value,
      };
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    idUser?: string | null,
    idProject?: string | null,
    optionsInput?: GetDocumentsInput<DocumentEntity>,
  ) {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async getByIdProject(idProject: string) {
    try {
      const result = await this.documentRepository.find({
        where: { project: { idProject } },
        relations: {
          project: { user: true, priority: true },
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteByIdProject(idProject: string) {
    try {
      await this.documentRepository.delete({ project: { idProject } });
    } catch (error) {
      throw error;
    }
  }

  async deleteById(idUser: string, idDocument: string) {
    try {
      const document = await this.documentRepository.findOne({
        where: { project: { user: { idUser } }, idDocument },
      });
      if (!document) throw new NotFoundException('Document not found!');
      rmSync(join(process.cwd(), document.pathDocument), {
        force: true,
        recursive: true,
      });
      await this.documentRepository.delete(idDocument);
      return document;
    } catch (error) {
      throw error;
    }
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
          new BadGatewayException('Could not save image');
        });
    });
  }

  async createDocument(uploadDocumentInput: UploadDocumentInput) {
    try {
      const document = await uploadDocumentInput.file;
      const pathName = `/uploads/projects/${uploadDocumentInput.idProject}`;
      const pathDocumentToSave = await this.saveDocumentToDir(
        document,
        pathName,
      );
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
    } catch (error) {
      throw error;
    }
  }
}
