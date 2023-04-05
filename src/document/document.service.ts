/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createWriteStream, rmSync } from 'fs';
import { FileUpload } from 'graphql-upload-ts';
import { join } from 'path';
import { ILike, In, Repository } from 'typeorm';
import {
  GetDocumentsInput,
  SearchDocumentsInput,
} from './dto/get-documents.input';
import { UpdateDocumentInput } from './dto/update-document.dto';
import { UploadDocumentInput } from './dto/upload-document.dto';
import { DocumentEntity } from './entities/document.entity';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity)
    private documentRepository: Repository<DocumentEntity>,
  ) {}

  async restFindAll(
    idUser?: string | null,
    idProject?: string | null,
    optionsInput?: GetDocumentsInput<DocumentEntity>,
  ) {
    try {
      const order = optionsInput?.sort;
      const skip = optionsInput?.pagination?.skip;
      const take = optionsInput?.pagination?.take;
      const result = await this.documentRepository.find({
        where: {
          project: {
            user: { idUser },
            idProject: idProject
              ? idProject
              : ILike(`%${optionsInput?.search.idProject || ''}%`),
          },
          idDocument: ILike(`%${optionsInput?.search?.idDocument || ''}%`),
          documentName: ILike(`%${optionsInput?.search?.documentName || ''}%`),
          description: ILike(`%${optionsInput?.search?.description || ''}%`),
          pathDocument: ILike(`%${optionsInput?.search?.pathDocument || ''}%`),
        },
        skip,
        take: 1,
        order,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async countDocument(
    idUser: string | null,
    idProject: string | null,
    searchDocumentsInput: SearchDocumentsInput,
  ) {
    try {
      const result = await this.documentRepository.count({
        where: {
          project: {
            user: { idUser },
            idProject: idProject
              ? idProject
              : ILike(`%${searchDocumentsInput?.idProject || ''}%`),
          },
          idDocument: ILike(`%${searchDocumentsInput?.idDocument || ''}%`),
          documentName: ILike(`%${searchDocumentsInput?.documentName || ''}%`),
          description: ILike(`%${searchDocumentsInput?.description || ''}%`),
          pathDocument: ILike(`%${searchDocumentsInput?.pathDocument || ''}%`),
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateDocument(updateDocumentInput: UpdateDocumentInput) {
    try {
      const document = await updateDocumentInput.file;
      const existDocument = await this.documentRepository.findOne({
        where: { idDocument: updateDocumentInput.idDocument },
      });
      if (!existDocument) throw new NotFoundException('Document not found!');
      const pathName = `/uploads/projects/${updateDocumentInput.idProject}`;
      const pathDocumentToSave = await this.saveDocumentToDir(
        document,
        pathName,
      );
      const { idProject, idDocument, file, ...values } = updateDocumentInput;
      const value = await this.documentRepository.create({
        ...values,
        pathDocument: pathDocumentToSave,
      });
      await this.documentRepository.update(idDocument, value);
      rmSync(join(process.cwd(), existDocument.pathDocument));
      return value;
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
      const result = await this.documentRepository.find({
        where: {
          project: {
            user: { idUser },
            idProject: idProject
              ? idProject
              : ILike(`%${optionsInput?.search.idProject || ''}%`),
          },
          idDocument: ILike(`%${optionsInput?.search?.idDocument || ''}%`),
          documentName: ILike(`%${optionsInput?.search?.documentName || ''}%`),
          description: ILike(`%${optionsInput?.search?.description || ''}%`),
          pathDocument: ILike(`%${optionsInput?.search?.pathDocument || ''}%`),
        },
        relations: {
          project: { user: true },
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

  async deleteById(idDocument: string) {
    try {
      const document = await this.documentRepository.findOne({
        where: { idDocument },
      });
      if (!document) throw new NotFoundException('Document not found!');
      rmSync(join(process.cwd(), document.pathDocument));
      await this.documentRepository.delete(idDocument);
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
      const value = await this.documentRepository.create({
        project: { idProject: uploadDocumentInput.idProject },
        idDocument: uuid4(),
        ...uploadDocumentInput,
        pathDocument: pathDocumentToSave,
      });
      await this.documentRepository.save(value);
    } catch (error) {
      throw error;
    }
  }
}
