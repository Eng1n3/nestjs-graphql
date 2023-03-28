import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createWriteStream, rmSync } from 'fs';
import { FileUpload } from 'graphql-upload-ts';
import { join } from 'path';
import { In, Repository } from 'typeorm';
import { UploadDocumentInput } from './dto/upload-document.dto';
import { DocumentEntity } from './entities/document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity)
    private documentRepository: Repository<DocumentEntity>,
  ) {}

  async findAll(idProjects: string[]) {
    try {
      const result = await this.documentRepository.find({
        where: {
          idProject: In(idProjects),
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getByIdProject(idProject: string) {
    try {
      const result = await this.documentRepository.find({
        where: { idProject },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteByIdProject(idProject: string) {
    try {
      await this.documentRepository.delete({ idProject });
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
        ...uploadDocumentInput,
        pathDocument: pathDocumentToSave,
      });
      await this.documentRepository.save(value);
    } catch (error) {
      throw error;
    }
  }
}
