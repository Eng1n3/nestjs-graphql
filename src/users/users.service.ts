/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import {
  RegisterAdminInput,
  RegisterUserInput,
} from 'src/users/dto/register.input';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { GetUserInput } from './dto/get-user.input';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from './dto/update.input';
import { createWriteStream, mkdirSync, readdirSync, rmSync } from 'fs';
import { join } from 'path';
import { FileUpload } from 'graphql-upload-ts';

@Injectable()
export class UsersService {
  private getSalt = bcrypt.genSaltSync();

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

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

  async updateUser(
    idUser: string,
    registerUserInput: UpdateUserInput,
  ): Promise<User> {
    try {
      let pathImageToSave;
      const validImage = /(png|jpeg|image|img)/g;
      const image = await registerUserInput?.image;
      const existUser = await this.userRepository.findOne({
        where: { idUser },
        relations: {
          project: {
            priority: true,
            document: true,
          },
        },
      });
      if (registerUserInput?.password) {
        registerUserInput.password = await bcrypt.hash(
          registerUserInput.password,
          this.getSalt,
        );
      }

      if (image) {
        const existImage = readdirSync(
          join(process.cwd(), '/uploads/profiles/', idUser),
        );
        if (existImage.length) rmSync(join(process.cwd(), existUser.pathImage));
        if (!validImage.test(image.mimetype))
          throw new BadRequestException('File tidak valid!');
        const pathImage = `/uploads/profiles/${idUser}`;
        pathImageToSave = await this.saveDocumentToDir(image, pathImage);
      }
      const value = this.userRepository.create({
        idUser,
        ...registerUserInput,
        pathImage: pathImageToSave,
      });
      await this.userRepository.update(idUser, value);
      const result = {
        ...existUser,
        ...value,
      };
      return result;
    } catch (error) {
      if (
        error.message.includes('duplicate key value') &&
        error?.detail?.includes('email')
      ) {
        throw new BadRequestException('Email sudah digunakan!');
      }
      throw error;
    }
  }

  async deleteUser(idUser: string) {
    const checkUser = await this.userRepository.findOne({
      where: { idUser },
      relations: { project: { priority: true, document: true } },
    });
    if (!checkUser) throw new NotFoundException('User not found');

    await this.userRepository.delete(idUser);

    rmSync(join(process.cwd(), `/uploads/profiles/${checkUser?.idUser}`), {
      recursive: true,
      force: true,
    });

    checkUser?.project?.forEach(({ idProject }) =>
      rmSync(join(process.cwd(), `/uploads/projects/${idProject}`), {
        recursive: true,
        force: true,
      }),
    );
    return checkUser;
  }

  async updatePassword(idUser: string, password: string) {
    await this.userRepository.update(idUser, { password });
  }

  async findOneByIdUser(idUser: string): Promise<User> {
    const result = await this.userRepository.findOne({
      where: { idUser },
      relations: {
        project: {
          priority: true,
          document: true,
        },
      },
    });
    return result;
  }

  async findOneByEmail(email: string): Promise<User> {
    const result = await this.userRepository.findOne({
      where: { email },
      relations: {
        project: {
          priority: true,
          document: true,
        },
      },
    });
    return result;
  }

  async createUser(
    role: string,
    registerUserInput: RegisterUserInput | RegisterAdminInput,
  ): Promise<User> {
    try {
      const hashPassword = await bcrypt.hash(
        registerUserInput.password,
        this.getSalt,
      );
      const pathImage = '/uploads/default-user.jpg';
      const value = await this.userRepository.create({
        idUser: uuidv4(),
        ...registerUserInput,
        pathImage,
        password: hashPassword,
        role,
      });
      await this.userRepository.save(value);
      mkdirSync(join(process.cwd(), `/uploads/profiles/${value.idUser}`), {
        recursive: true,
      });
      return value;
    } catch (error) {
      if (
        error.message.includes('duplicate key value') &&
        error?.detail?.includes('email')
      ) {
        throw new BadRequestException('Email sudah digunakan!');
      }
      throw error;
    }
  }

  async findAll(getUserInput: GetUserInput<User>) {
    const order = getUserInput?.sort;
    const skip = getUserInput?.pagination?.skip;
    const take = getUserInput?.pagination?.take;
    const result = await this.userRepository.find({
      where: [
        {
          email: ILike(`%${getUserInput?.search || ''}%`),
          role: 'user',
        },
        {
          fullname: ILike(`%${getUserInput?.search || ''}%`),
          role: 'user',
        },
      ],
      relations: {
        project: {
          priority: true,
          document: true,
        },
      },
      skip,
      take,
      order,
    });
    return result;
  }

  async count(searchUserInput?: string) {
    const result = await this.userRepository.count({
      where: [
        {
          email: ILike(`%${searchUserInput || ''}%`),
          role: 'user',
        },
        {
          fullname: ILike(`%${searchUserInput || ''}%`),
          role: 'user',
        },
      ],
    });
    return result;
  }
}
