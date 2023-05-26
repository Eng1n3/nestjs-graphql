/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { Project } from 'src/project/entities/project.entity';
import { Dirent } from 'fs';
import { FileUpload } from 'graphql-upload';
import { WriteStream } from 'fs';

jest.mock('bcrypt');
type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

describe('UsersService', () => {
  let usersService: UsersService;
  const userRepositoryMock: MockType<Repository<User>> = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  describe('Menghitung total user', () => {
    let total: number;
    beforeEach(() => {
      total = 1;
      userRepositoryMock.count.mockReturnValue(Promise.resolve(total));
    });
    it('Kembalian success', async () => {
      const countUser = await usersService.count();
      expect(countUser).toEqual(total);
    });
  });

  describe('Mendapatkan semua user', () => {
    let user: User[];
    beforeEach(() => {
      user = [new User()];
      userRepositoryMock.find.mockReturnValue(Promise.resolve(user));
    });
    it('Kembalian success', async () => {
      const fetchedUser = await usersService.findAll({
        pagination: { skip: 0, take: 5 },
      });
      expect(fetchedUser).toEqual(user);
    });
  });

  describe('Mendapatkan user dari idUser', () => {
    let user: User;
    beforeEach(() => {
      user = new User();
      userRepositoryMock.findOne.mockReturnValue(Promise.resolve(user));
    });
    it('Kembalian success', async () => {
      const fetchedUser = await usersService.findOneByIdUser('id-user');
      expect(fetchedUser).toEqual(user);
    });
  });

  describe('Mendapatkan user dari email', () => {
    let user: User;
    beforeEach(() => {
      user = new User();
      userRepositoryMock.findOne.mockReturnValue(Promise.resolve(user));
    });
    it('Kembalian success', async () => {
      const fetchedUser = await usersService.findOneByEmail('test@test.com');
      expect(fetchedUser).toEqual(user);
    });
  });

  describe('Membuat user', () => {
    describe('Success membuat user', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        jest
          .spyOn(fs, 'mkdirSync')
          .mockImplementationOnce((pth, opts) => 'true');
        userRepositoryMock.create.mockReturnValue(user);
        userRepositoryMock.save.mockReturnValue(Promise.resolve(true));
      });
      it('Kembalian success', async () => {
        const createUser = await usersService.createUser('user', {
          email: 'test@test.com',
          password: 'Sup3rstrong_password',
          repassword: 'Sup3rstrong_password',
          fullname: 'unit tesing',
          birthDay: '2002-03-23',
        });
        expect(createUser).toEqual(user);
      });
    });

    describe('Duplikat membuat user', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        jest
          .spyOn(fs, 'mkdirSync')
          .mockImplementationOnce((pth, opts) => 'true');
        userRepositoryMock.create.mockReturnValueOnce(new User());
        userRepositoryMock.save.mockRejectedValueOnce({
          message: 'duplicate key value',
          detail: 'email',
        });
      });
      it('Kembalian error', async () => {
        try {
          await usersService.createUser('user', {
            email: 'test@test.com',
            password: 'Sup3rstrong_password',
            repassword: 'Sup3rstrong_password',
            fullname: 'unit tesing',
            birthDay: '2002-03-23',
          });
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });
    });
  });
  describe('Melakukan update password user', () => {
    beforeEach(() => {
      userRepositoryMock.update.mockReturnValue(Promise.resolve(true));
    });
    it('Kembalian success', async () => {
      const updatePassword = await usersService.updatePassword(
        'testing-12345',
        'password_testing',
      );
      expect(updatePassword).toEqual(undefined);
    });
  });

  describe('Melakukan update user', () => {
    describe('Success dengan tanpa update image', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        user.pathImage = '';
        jest
          .spyOn(fs, 'readdirSync')
          .mockReturnValueOnce(['ini'] as unknown as Dirent[]);
        jest
          .spyOn(fs, 'rmSync')
          .mockImplementationOnce(function (path, options) {
            true;
          });
        userRepositoryMock.findOne.mockResolvedValueOnce(user);
        userRepositoryMock.create.mockReturnValue(user);
        userRepositoryMock.update.mockReturnValue(Promise.resolve(true));
      });
      it('Kembalian success', async () => {
        const updateUser = await usersService.updateUser('testing-1234', {
          email: 'testin@gmail.com',
          birthDay: '2023-04-01',
          password: 'password_testing',
        });
        expect(updateUser).toEqual(user);
      });
    });

    describe('Success dengan sudah ada image', () => {
      let user: User;
      let mockFile: Promise<FileUpload>;
      beforeEach(() => {
        user = new User();
        user.pathImage = '';
        jest
          .spyOn(fs, 'readdirSync')
          .mockReturnValueOnce(['ini'] as unknown as Dirent[]);
        jest
          .spyOn(fs, 'rmSync')
          .mockImplementationOnce(function (path, options) {
            true;
          });
        const mockWriteStream = {
          on: jest.fn().mockImplementationOnce(function (this, event, handler) {
            if (event === 'finish') {
              handler();
            }
            return this;
          }),
        };
        const mockReadStream = {
          pipe: jest.fn().mockReturnValueOnce(mockWriteStream),
        };
        mockFile = new Promise((resolve) =>
          resolve({
            filename: 'test',
            mimetype: 'image/jpeg',
            encoding: '7bit',
            createReadStream: jest.fn().mockReturnValueOnce(mockReadStream),
          }),
        );
        jest
          .spyOn(fs, 'createWriteStream')
          .mockReturnValueOnce(mockWriteStream as unknown as WriteStream);
        userRepositoryMock.findOne.mockResolvedValueOnce(user);
        userRepositoryMock.create.mockReturnValue(user);
        userRepositoryMock.update.mockReturnValue(Promise.resolve(true));
      });
      it('Kembalian success', async () => {
        const updateUser = await usersService.updateUser('testing-1234', {
          email: 'testin@gmail.com',
          birthDay: '2023-04-01',
          password: 'password_testing',
          image: mockFile,
        });
        expect(updateUser).toEqual(user);
      });
    });

    describe('error mimetype dan belum image', () => {
      let user: User;
      let mockFile: Promise<FileUpload>;
      beforeEach(() => {
        user = new User();
        user.pathImage = '';
        jest
          .spyOn(fs, 'readdirSync')
          .mockImplementationOnce((path, options) => []);
        jest.spyOn(fs, 'rmSync').mockImplementationOnce((path, options) => {
          true;
        });
        const mockWriteStream = {
          on: jest.fn().mockImplementationOnce(function (this, event, handler) {
            if (event === 'finish') {
              handler();
            }
            return this;
          }),
        };
        const mockReadStream = {
          pipe: jest.fn().mockReturnValueOnce(mockWriteStream),
        };
        mockFile = new Promise((resolve) =>
          resolve({
            filename: 'test',
            mimetype: 'testmime',
            encoding: '7bit',
            createReadStream: jest.fn().mockReturnValueOnce(mockReadStream),
          }),
        );
        jest
          .spyOn(fs, 'createWriteStream')
          .mockReturnValueOnce(mockWriteStream as unknown as WriteStream);
        userRepositoryMock.findOne.mockResolvedValueOnce(user);
        userRepositoryMock.create.mockReturnValue(user);
        userRepositoryMock.update.mockReturnValue(Promise.resolve(true));
      });
      it('Kembalian error mime type', async () => {
        await expect(
          usersService.updateUser('testing-1234', {
            email: 'testin@gmail.com',
            birthDay: '2023-04-01',
            password: 'password_testing',
            image: mockFile,
          }),
        ).rejects.toThrow();
      });
    });

    describe('error duplikat email', () => {
      let user: User;
      let mockFile: Promise<FileUpload>;
      beforeEach(() => {
        user = new User();
        user.pathImage = '';
        jest
          .spyOn(fs, 'readdirSync')
          .mockImplementationOnce((path, options) => []);
        jest.spyOn(fs, 'rmSync').mockImplementationOnce((path, options) => {
          true;
        });
        const mockWriteStream = {
          on: jest.fn().mockImplementationOnce(function (this, event, handler) {
            if (event === 'finish') {
              handler();
            }
            return this;
          }),
        };
        const mockReadStream = {
          pipe: jest.fn().mockReturnValueOnce(mockWriteStream),
        };
        mockFile = new Promise((resolve) =>
          resolve({
            filename: 'test',
            mimetype: 'image/jpeg',
            encoding: '7bit',
            createReadStream: jest.fn().mockReturnValueOnce(mockReadStream),
          }),
        );
        jest
          .spyOn(fs, 'createWriteStream')
          .mockReturnValueOnce(mockWriteStream as unknown as WriteStream);
        userRepositoryMock.findOne.mockResolvedValueOnce(user);
        userRepositoryMock.create.mockReturnValue(user);
        userRepositoryMock.update.mockRejectedValueOnce({
          message: 'duplicate key value',
          detail: 'email',
        });
      });
      it('Return error duplikat email', async () => {
        await expect(
          usersService.updateUser('testing-1234', {
            email: 'testin@gmail.com',
            birthDay: '2023-04-01',
            password: 'password_testing',
            image: mockFile,
          }),
        ).rejects.toThrow();
      });
    });
  });

  describe('Mendelete user', () => {
    describe('Success delete user', () => {
      let user: User;
      beforeEach(() => {
        user = { ...new User(), project: [{ ...new Project() }] };
        user.idUser = 'testing-iduser';
        jest.spyOn(fs, 'rmSync').mockImplementationOnce((path, options) => {
          true;
        });
        userRepositoryMock.findOne.mockReturnValue(Promise.resolve(user));
        userRepositoryMock.delete.mockReturnValue(Promise.resolve(true));
      });
      it('Kembalian success', async () => {
        const createUser = await usersService.deleteUser('user-asdjoj-3283298');
        expect(createUser).toEqual(user);
      });
    });

    describe('error delete user', () => {
      let user: User;
      beforeEach(() => {
        user = { ...new User(), project: [{ ...new Project() }] };
        jest.spyOn(fs, 'rmSync').mockImplementationOnce((path, options) => {
          true;
        });
        userRepositoryMock.findOne.mockResolvedValueOnce({});
        userRepositoryMock.delete.mockResolvedValueOnce(true);
      });
      it('Return error tidak ada user', async () => {
        await expect(
          usersService.deleteUser('user-asdjoj-3283298'),
        ).rejects.toThrow();
      });
    });
  });
});
