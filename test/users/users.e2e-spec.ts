/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { User } from 'src/users/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { Project } from 'src/project/entities/project.entity';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { ProjectService } from 'src/project/project.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as fs from 'fs';
import { Dirent, WriteStream } from 'fs';
import { FileUpload } from 'graphql-upload';
import { ReadStream } from 'typeorm/platform/PlatformTools';
import { join } from 'path';
import { DocumentEntity } from 'src/document/entities/document.entity';
import { Priority } from 'src/priority/entities/priority.entity';

type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

jest.setTimeout(1000000000);

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let url: string;

  const pubsubMock: MockType<PubSub> = {
    publish: jest.fn(),
    asyncIterator: jest.fn(),
  };

  const projectRepositoryMock: MockType<Repository<Project>> = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
  };

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
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PUB_SUB)
      .useValue(pubsubMock)
      .overrideProvider(getRepositoryToken(User))
      .useValue(userRepositoryMock)
      .overrideProvider(getRepositoryToken(Project))
      .useValue(projectRepositoryMock)
      .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const gql = '/graphql';

  describe('e2e messageDeleteUser', () => {
    describe('Success messageDeleteUser', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        query = 'mutation { messageDeleteUser }';
        jest
          .spyOn(jwt, 'verify')
          .mockImplementationOnce((token, secretOrKey, options, callback) =>
            callback(null, {
              idUser: '2bb16d2e-a316-4ced-8f32-94263a3aa7a4',
              email: 'testing@gmail.com',
              role: 'admin',
            }),
          );
        userRepositoryMock.findOne.mockResolvedValueOnce(user);
      });
      it('mutation messageDeleteUser', async () => {
        const response = await request(app.getHttpServer())
          .post(gql)
          .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A',
          )
          .send({
            query,
          })
          .expect(200);
        expect(response.body).toEqual({
          data: { messageDeleteUser: 'Success delete user' },
        });
      });
    });
  });

  describe('e2e messageRegisterUser', () => {
    describe('Success messageRegisterUser', () => {
      let query: string;
      beforeEach(() => {
        query = 'mutation { messageRegisterUser }';
      });
      it('mutation messageRegiterUser', async () => {
        const response = await request(app.getHttpServer())
          .post(gql)
          .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A',
          )
          .send({
            query,
          })
          .expect(200);
        expect(response.body).toEqual({
          data: { messageRegisterUser: 'Success registrasi user' },
        });
      });
    });
  });

  describe('e2e messageUser', () => {
    describe('Success messageUser', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        query = 'query { messageUser }';
        jest
          .spyOn(jwt, 'verify')
          .mockImplementationOnce((token, secretOrKey, options, callback) =>
            callback(null, {
              idUser: '2bb16d2e-a316-4ced-8f32-94263a3aa7a4',
              email: 'testing@gmail.com',
              role: 'user',
            }),
          );
        userRepositoryMock.findOne.mockResolvedValueOnce(user);
      });
      it('query messageUser', async () => {
        const response = await request(app.getHttpServer())
          .post(gql)
          .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A',
          )
          .send({
            query,
          })
          .expect(200);
        expect(response.body).toEqual({
          data: { messageUser: 'Success mendapatkan data user' },
        });
      });
    });
  });

  describe('e2e messageUpdateUser', () => {
    describe('Success messageUpdateUser', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        query = 'mutation { messageUpdateUser }';
        jest
          .spyOn(jwt, 'verify')
          .mockImplementationOnce((token, secretOrKey, options, callback) =>
            callback(null, {
              idUser: '2bb16d2e-a316-4ced-8f32-94263a3aa7a4',
              email: 'testing@gmail.com',
              role: 'user',
            }),
          );
        userRepositoryMock.findOne.mockResolvedValueOnce(user);
      });
      it('mutation messageUpdateUser', async () => {
        const response = await request(app.getHttpServer())
          .post(gql)
          .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A',
          )
          .send({
            query,
          })
          .expect(200);
        expect(response.body).toEqual({
          data: { messageUpdateUser: 'Success update user' },
        });
      });
    });
  });

  describe('e2e deleteUser', () => {
    describe('Success', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = { ...new User(), project: [{ ...new Project() }] };
        user.email = 'testuser@gmail.com';
        user.birthDay = '2023-01-01' as unknown as Date;
        user.idUser = 'testing-iduser';
        query =
          'mutation { deleteUser(idUser: "905de7b3-6567-4335-8ebe-4132c4b34546") { email birthDay } }';
        jest.spyOn(fs, 'rmSync').mockImplementationOnce((path, options) => {
          true;
        });
        jest
          .spyOn(jwt, 'verify')
          .mockImplementationOnce((token, secretOrKey, options, callback) =>
            callback(null, {
              idUser: '2bb16d2e-a316-4ced-8f32-94263a3aa7a4',
              email: 'testing@gmail.com',
              role: 'admin',
            }),
          );
        userRepositoryMock.findOne.mockResolvedValue(user);
        userRepositoryMock.delete.mockResolvedValueOnce(true);
      });
      it('mutation deleteUser', async () => {
        const response = await request(app.getHttpServer())
          .post(gql)
          .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A',
          )
          .send({
            query,
          })
          .expect(200);
        expect(response.body).toEqual({
          data: {
            deleteUser: {
              birthDay: '2023-01-01',
              email: 'testuser@gmail.com',
            },
          },
        });
      });
      afterEach(() => {
        userRepositoryMock.findOne.mockReset();
      });
    });
    describe('error user tidak ada', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = { ...new User(), project: [{ ...new Project() }] };
        user.email = 'testusererror@gmail.com';
        user.birthDay = '2023-01-02' as unknown as Date;
        user.idUser = 'testing-iduser';
        query =
          'mutation { deleteUser(idUser: "905de7b3-6567-4335-8ebe-4132c4b34546") { email birthDay } }';
        jest.spyOn(fs, 'rmSync').mockImplementationOnce((path, options) => {
          true;
        });
        jest
          .spyOn(jwt, 'verify')
          .mockImplementationOnce((token, secretOrKey, options, callback) =>
            callback(null, {
              idUser: '2bb16d2e-a316-4ced-8f32-94263a3aa7a4',
              email: 'testing@gmail.com',
              role: 'admin',
            }),
          );

        userRepositoryMock.findOne.mockImplementation((query: any) => {
          if (query.where.idUser === '905de7b3-6567-4335-8ebe-4132c4b34546')
            return {};
          return user;
        });
        userRepositoryMock.delete.mockResolvedValueOnce(true);
      });
      it('mutation deleteUser', async () => {
        const response = await request(app.getHttpServer())
          .post(gql)
          .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A',
          )
          .send({
            query,
          })
          .expect(200);

        expect(response.body.errors[0].message).toEqual('User tidak ada!');
        expect(response.body.data).toBeNull();
      });
      afterEach(() => {
        userRepositoryMock.findOne.mockReset();
      });
    });
  });

  describe('e2e updateUser', () => {
    describe('Success dengan tanpa update image', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        user.email = 'testuser@gmail.com';
        user.birthDay = '2023-01-01' as unknown as Date;
        user.pathImage = '';
        query =
          'mutation { updateUser(input: { fullname: "testing update" password: "password_testing" }) { email fullname } }';
        jest
          .spyOn(jwt, 'verify')
          .mockImplementationOnce((token, secretOrKey, options, callback) =>
            callback(null, {
              idUser: '2bb16d2e-a316-4ced-8f32-94263a3aa7a4',
              email: 'testing@gmail.com',
              role: 'user',
            }),
          );
        jest
          .spyOn(fs, 'readdirSync')
          .mockReturnValueOnce(['ini'] as unknown as fs.Dirent[]);
        jest
          .spyOn(fs, 'rmSync')
          .mockImplementationOnce(function (path, options) {
            true;
          });
        userRepositoryMock.findOne.mockResolvedValue(user);
        user.fullname = 'testing update';
        userRepositoryMock.create.mockResolvedValueOnce(user);
        userRepositoryMock.update.mockResolvedValueOnce(user);
      });
      it('mutation updateUser', async () => {
        const response = await request(app.getHttpServer())
          .post(gql)
          .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A',
          )
          .send({
            query,
          })
          .expect(200);
        expect(response.body).toEqual({
          data: {
            updateUser: {
              email: 'testuser@gmail.com',
              fullname: 'testing update',
            },
          },
        });
      });
      afterEach(() => {
        userRepositoryMock.findOne.mockReset();
      });
    });

    describe('error duplikat email', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        user.email = 'testuser@gmail.com';
        user.birthDay = '2023-01-01' as unknown as Date;
        user.pathImage = '';
        query =
          'mutation { updateUser(input: { fullname: "testing update" password: "password_testing" }) { email fullname } }';
        jest
          .spyOn(jwt, 'verify')
          .mockImplementationOnce((token, secretOrKey, options, callback) =>
            callback(null, {
              idUser: '2bb16d2e-a316-4ced-8f32-94263a3aa7a4',
              email: 'testing@gmail.com',
              role: 'user',
            }),
          );
        jest
          .spyOn(fs, 'readdirSync')
          .mockReturnValueOnce(['ini'] as unknown as fs.Dirent[]);
        jest
          .spyOn(fs, 'rmSync')
          .mockImplementationOnce(function (path, options) {
            true;
          });
        userRepositoryMock.findOne.mockResolvedValue(user);
        user.fullname = 'testing update';
        userRepositoryMock.create.mockResolvedValueOnce(user);
        userRepositoryMock.update.mockRejectedValueOnce({
          message: 'duplicate key value',
          detail: 'email',
        });
      });
      it('mutation updateUser', async () => {
        const response = await request(app.getHttpServer())
          .post(gql)
          .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A',
          )
          .send({
            query,
          })
          .expect(200);
        expect(response.body.errors[0].message).toEqual(
          'Email sudah digunakan!',
        );
        expect(response.body.data).toBeNull();
      });
      afterEach(() => {
        userRepositoryMock.findOne.mockReset();
        userRepositoryMock.create.mockReset();
      });
    });
  });

  describe('e2e registerUser', () => {
    describe('Success registerUser', () => {
      let query: string;
      let user: User;
      let variables: any;
      beforeEach(() => {
        user = new User();
        user.email = 'testuser@gmail.com';
        user.fullname = 'testing fullname';
        user.birthDay = '2022-12-31' as unknown as Date;
        query =
          'mutation { registerUser(input: { email: "testuser@gmail.com" password: "Sup3rstrong_password" repassword: "Sup3rstrong_password" fullname: "testing fullname" birthDay: "2022-12-31" homepage: "http://github.com/eng1n3" } ) { email fullname } }';
        userRepositoryMock.create.mockResolvedValueOnce(user);
        userRepositoryMock.save.mockResolvedValueOnce(true);
      });
      it('mutation registerUser', async () => {
        const response = await request(app.getHttpServer())
          .post(gql)
          .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A',
          )
          .send({
            query,
          })
          .expect(200);

        expect(response.body).toEqual({
          data: {
            registerUser: {
              email: 'testuser@gmail.com',
              fullname: 'testing fullname',
            },
          },
        });
      });
    });

    describe('error duplikat email', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        user.email = 'testuser@gmail.com';
        user.fullname = 'testing fullname';
        user.birthDay = '2022-12-31' as unknown as Date;
        query =
          'mutation { registerUser(input: { email: "testuser@gmail.com" password: "Sup3rstrong_password" repassword: "Sup3rstrong_password" fullname: "testing fullname" birthDay: "2022-12-31" homepage: "http://github.com/eng1n3" } ) { email fullname } }';
        userRepositoryMock.create.mockResolvedValueOnce(user);
        userRepositoryMock.save.mockRejectedValueOnce({
          message: 'duplicate key value',
          detail: 'email',
        });
      });
      it('mutation registerUser', async () => {
        const response = await request(app.getHttpServer())
          .post(gql)
          .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A',
          )
          .send({
            query,
          })
          .expect(200);

        expect(response.body.errors[0].message).toEqual(
          'Email sudah digunakan!',
        );
        expect(response.body.data).toBeNull();
      });
    });
  });

  describe('e2e user', () => {
    describe('Success user', () => {
      let query: string;
      let user: User;
      let project: Project;
      let document: DocumentEntity;
      let priority: Priority;
      beforeEach(() => {
        user = new User();
        project = new Project();
        priority = new Priority();
        document = new DocumentEntity();
        priority.name = 'priority testing';
        document.documentName = 'dokumen testing';
        project.projectName = 'project testing';
        project.document = [document];
        project.priority = priority;
        user.idUser = '2bb16d2e-a316-4ced-8f32-94263a3aa7a4';
        user.email = 'adambrilian003@gmail.com';
        user.role = 'user';
        project.user = user;
        document.project = project;
        query = `query { user { idUser email role project(options: { sort: {}, search: "" }) { projectName priority { name } document { documentName } } } }`;
        jest
          .spyOn(jwt, 'verify')
          .mockImplementationOnce((token, secretOrKey, options, callback) =>
            callback(null, {
              idUser: '2bb16d2e-a316-4ced-8f32-94263a3aa7a4',
              email: 'adambrilian003@gmail.com',
              role: 'user',
            }),
          );
        userRepositoryMock.findOne.mockResolvedValue(user);
        projectRepositoryMock.find.mockResolvedValueOnce([project]);
      });
      it('query countAccount', async () => {
        const response = await request(app.getHttpServer())
          .post(gql)
          .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A',
          )
          .send({
            query,
          })
          .expect(200);

        expect(response.body).toEqual({
          data: {
            user: {
              idUser: '2bb16d2e-a316-4ced-8f32-94263a3aa7a4',
              email: 'adambrilian003@gmail.com',
              role: 'user',
              project: [
                {
                  projectName: 'project testing',
                  priority: { name: 'priority testing' },
                  document: [],
                },
              ],
            },
          },
        });
      });
      afterEach(() => {
        userRepositoryMock.findOne.mockReset();
      });
    });
  });

  describe('e2e users', () => {
    describe('Success', () => {
      let query: string;
      let user: User;
      let project: Project;
      let document: DocumentEntity;
      let priority: Priority;
      beforeEach(() => {
        user = new User();
        project = new Project();
        priority = new Priority();
        document = new DocumentEntity();
        priority.name = 'priority testing';
        document.documentName = 'dokumen testing';
        project.projectName = 'project testing';
        project.document = [document];
        project.priority = priority;
        user.idUser = '2bb16d2e-a316-4ced-8f32-94263a3aa7a4';
        user.email = 'adambrilian003@gmail.com';
        user.role = 'user';
        project.user = user;
        document.project = project;
        query = `query { users { idUser email role project(options: { sort: {}, search: "" }) { projectName priority { name } document { documentName } } } }`;
        jest
          .spyOn(jwt, 'verify')
          .mockImplementationOnce((token, secretOrKey, options, callback) =>
            callback(null, {
              idUser: '2bb16d2e-a316-4ced-8f32-94263a3aa7a4',
              email: 'adambrilian003@gmail.com',
              role: 'admin',
            }),
          );
        userRepositoryMock.find.mockResolvedValueOnce([user]);
        userRepositoryMock.findOne.mockResolvedValue(user);
        projectRepositoryMock.find.mockResolvedValueOnce([project]);
      });
      it('query countAccount', async () => {
        const response = await request(app.getHttpServer())
          .post(gql)
          .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A',
          )
          .send({
            query,
          })
          .expect(200);
        expect(response.body).toEqual({
          data: {
            users: [
              {
                idUser: '2bb16d2e-a316-4ced-8f32-94263a3aa7a4',
                email: 'adambrilian003@gmail.com',
                role: 'user',
                project: [
                  {
                    projectName: 'project testing',
                    priority: { name: 'priority testing' },
                    document: [],
                  },
                ],
              },
            ],
          },
        });
      });
      afterEach(() => {
        userRepositoryMock.findOne.mockReset();
      });
    });
  });

  describe('e2e countAccount', () => {
    describe('Success countAccount', () => {
      let query: string;
      let total: number;
      let user: User;
      beforeEach(() => {
        user = new User();
        query = 'query { countAccount }';
        total = 1;
        jest
          .spyOn(jwt, 'verify')
          .mockImplementationOnce((token, secretOrKey, options, callback) =>
            callback(null, {
              idUser: '2bb16d2e-a316-4ced-8f32-94263a3aa7a4',
              email: 'testing@gmail.com',
              role: 'admin',
            }),
          );
        userRepositoryMock.findOne.mockResolvedValue(user);
        userRepositoryMock.count.mockResolvedValueOnce(total);
      });
      it('query countAccount', async () => {
        const response = await request(app.getHttpServer())
          .post(gql)
          .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A',
          )
          .send({
            query,
          })
          .expect(200);

        expect(response.body).toEqual({ data: { countAccount: 1 } });
      });
      afterEach(() => {
        userRepositoryMock.findOne.mockReset();
      });
    });
  });
});
