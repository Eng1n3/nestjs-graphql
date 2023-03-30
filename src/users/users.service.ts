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
import { UpdateAdminInput, UpdateUserInput } from './dto/update.input';
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
    registerUserInput: UpdateUserInput | UpdateAdminInput,
  ): Promise<void> {
    try {
      let pathImageToSave;
      const validImage = /(png|jpeg|image|img)/g;
      const images = await registerUserInput?.image;

      const existUser = await this.userRepository.findOne({
        where: { idUser },
      });
      if (registerUserInput?.password) {
        registerUserInput.password = await bcrypt.hash(
          registerUserInput.password,
          this.getSalt,
        );
      }
      if (images) {
        const existImage = readdirSync(
          join(process.cwd(), '/uploads/profiles/', idUser),
        );
        if (existImage.length) rmSync(join(process.cwd(), existUser.pathImage));
        if (!validImage.test(images.mimetype))
          throw new BadRequestException('File not valid!');
        const pathImage = `/uploads/profiles/${idUser}`;
        pathImageToSave = await this.saveDocumentToDir(images, pathImage);
      }
      const value = this.userRepository.create({
        ...registerUserInput,
        idUser: uuidv4(),
        pathImage: pathImageToSave,
      });
      await this.userRepository.update(idUser, value);
    } catch (error) {
      if (
        error.message.includes('duplicate key value') &&
        error?.detail?.includes('username')
      ) {
        throw new BadRequestException('Username has been used!');
      } else if (
        error.message.includes('duplicate key value') &&
        error?.detail?.includes('email')
      ) {
        throw new BadRequestException('email has been used!');
      }
      throw error;
    }
  }

  async deleteUser(idUser: string) {
    try {
      const checkUser = await this.userRepository.findOne({
        where: { idUser },
      });
      if (!checkUser) throw new NotFoundException('User not found');
      await this.userRepository.delete(idUser);
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(idUser: string, password: string) {
    try {
      await this.userRepository.update(idUser, { password });
    } catch (error) {
      throw error;
    }
  }

  async findOne(usernameOrEmail: string): Promise<User> {
    try {
      const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (expression.test(usernameOrEmail)) {
        return await this.userRepository.findOne({
          where: { email: usernameOrEmail },
        });
      }
      return await this.userRepository.findOne({
        where: { username: usernameOrEmail },
      });
    } catch (error) {
      throw error;
    }
  }

  async createUser(
    role: string,
    registerUserInput: RegisterUserInput | RegisterAdminInput,
  ): Promise<void> {
    try {
      const hashPassword = await bcrypt.hash(
        registerUserInput.password,
        this.getSalt,
      );
      const pathImage = 'default-image.jpg';
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
    } catch (error) {
      if (
        error.message.includes('duplicate key value') &&
        error?.detail?.includes('username')
      ) {
        throw new BadRequestException('Username has been used!');
      } else if (
        error.message.includes('duplicate key value') &&
        error?.detail?.includes('email')
      ) {
        throw new BadRequestException('email has been used!');
      }
      throw error;
    }
  }

  async findAndCount(getUserInput: GetUserInput<User>) {
    try {
      const order = getUserInput.sort;
      const skip = getUserInput?.pagination?.skip;
      const take = getUserInput?.pagination?.take;
      const result = await this.userRepository.findAndCount({
        where: {
          role: 'user',
          username: ILike(`%${getUserInput?.search?.username || ''}%`),
          email: ILike(`%${getUserInput?.search?.email || ''}%`),
          fullname: ILike(`%${getUserInput?.search?.fullname || ''}%`),
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

  async count() {
    try {
      const result = await this.userRepository.count({
        where: { role: 'user' },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}
