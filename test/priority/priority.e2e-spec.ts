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
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
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

  const priorityRepositoryMock: MockType<Repository<Priority>> = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
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
      .overrideProvider(getRepositoryToken(Priority))
      .useValue(priorityRepositoryMock)
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

  describe('e2e messageDeletePriority', () => {
    describe('Success messageDeletePriority', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        query = 'mutation { messageDeletePriority }';
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
      it('mutation messageDeletePriority', async () => {
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
          data: { messageDeletePriority: 'Success delete Priority' },
        });
      });
    });
  });

  describe('e2e messageUpdatePriority', () => {
    describe('Success messageUpdatePriority', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        query = 'mutation { messageUpdatePriority }';
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
          data: { messageUpdatePriority: 'Success update Priority' },
        });
      });
    });
  });

  describe('e2e messageCreatePriority', () => {
    describe('Success messageCreatePriority', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        query = 'mutation { messageCreatePriority }';
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
          data: { messageCreatePriority: 'Success create Priority' },
        });
      });
    });
  });

  describe('e2e messagePriorities', () => {
    describe('Success messagePriorities', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        query = 'query { messagePriorities }';
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
      it('query messagePriorities', async () => {
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
          data: { messagePriorities: 'Success mendapatkan data Priority' },
        });
      });
    });
  });

  describe('e2e countPriorities', () => {
    describe('Success countPriorities', () => {
      let query: string;
      let user: User;
      let total: number;
      beforeEach(() => {
        total = 1;
        user = new User();
        query = 'query { countPriorities }';
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
        priorityRepositoryMock.count.mockResolvedValueOnce(total);
      });
      it('mutation countPriorities', async () => {
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
          data: { countPriorities: 1 },
        });
      });
      afterEach(() => {
        priorityRepositoryMock.findOne.mockReset();
      });
    });
  });

  describe('e2e deletePriority', () => {
    describe('Success deletePriority', () => {
      let query: string;
      let user: User;
      let priority: Priority;
      beforeEach(() => {
        user = new User();
        priority = new Priority();
        priority.idPriority = 'e0a8f072-a3ce-46d9-878a-ab1ffdc0e466';
        priority.name = 'normal';
        query =
          'mutation { deletePriority(idPriority: "e0a8f072-a3ce-46d9-878a-ab1ffdc0e466") { idPriority name } }';
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
        priorityRepositoryMock.findOne.mockResolvedValueOnce(priority);
        priorityRepositoryMock.delete.mockResolvedValueOnce(true);
      });
      it('mutation deletePriority', async () => {
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
            deletePriority: {
              idPriority: 'e0a8f072-a3ce-46d9-878a-ab1ffdc0e466',
              name: 'normal',
            },
          },
        });
      });
      afterEach(() => {
        priorityRepositoryMock.findOne.mockReset();
      });
    });

    describe('error prioritas tidak ada', () => {
      let query: string;
      let user: User;
      let priority: Priority;
      beforeEach(() => {
        user = new User();
        priority = new Priority();
        priority.idPriority = 'e0a8f072-a3ce-46d9-878a-ab1ffdc0e466';
        priority.name = 'normal';
        query =
          'mutation { deletePriority(idPriority: "e0a8f072-a3ce-46d9-878a-ab1ffdc0e466") { idPriority name } }';
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
        priorityRepositoryMock.findOne.mockResolvedValueOnce(null);
        priorityRepositoryMock.delete.mockResolvedValueOnce(true);
      });
      it('mutation deletePriority', async () => {
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
        expect(response.body.errors[0].message).toEqual('Prioritas tidak ada!');
        expect(response.body.data).toBeNull();
      });
      afterEach(() => {
        priorityRepositoryMock.findOne.mockReset();
      });
    });

    describe('error prioritas sedang digunakan', () => {
      let query: string;
      let user: User;
      let priority: Priority;
      let project: Project;
      beforeEach(() => {
        user = new User();
        project = new Project();
        project.idProject = '2bb16d2e-a316-4ced-8f32-94263a3a48h9';
        project.projectName = 'project testing';
        priority = new Priority();
        priority.idPriority = 'e0a8f072-a3ce-46d9-878a-ab1ffdc0e466';
        priority.name = 'normal';
        priority.project = [project];
        query =
          'mutation { deletePriority(idPriority: "e0a8f072-a3ce-46d9-878a-ab1ffdc0e466") { idPriority name } }';
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
        priorityRepositoryMock.findOne.mockResolvedValueOnce(priority);
      });
      it('mutation deletePriority', async () => {
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
          'Tidak bisa menghapus prioritas karena sedang digunakan',
        );
        expect(response.body.data).toBeNull();
      });
      afterEach(() => {
        priorityRepositoryMock.findOne.mockReset();
      });
    });
  });

  describe('e2e updatePriority', () => {
    describe('Success updatePriority', () => {
      let query: string;
      let user: User;
      let priority: Priority;
      beforeEach(() => {
        user = new User();
        priority = new Priority();
        priority.idPriority = 'e0a8f072-a3ce-46d9-878a-ab1ffdc0e466';
        priority.name = 'normal';
        query =
          'mutation { updatePriority(idPriority: "96c48076-2d20-4d34-a0df-fe68dbaa338f", name: "low") { idPriority name } }';
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
        priorityRepositoryMock.findOne.mockResolvedValueOnce(priority);
        priority.name = 'low';
        priorityRepositoryMock.create.mockResolvedValueOnce(priority);
        priorityRepositoryMock.update.mockResolvedValueOnce(true);
      });
      it('mutation updatePriority', async () => {
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
            updatePriority: {
              idPriority: 'e0a8f072-a3ce-46d9-878a-ab1ffdc0e466',
              name: 'low',
            },
          },
        });
      });
    });

    describe('Error duplikat nama prioritas', () => {
      let query: string;
      let user: User;
      let priority: Priority;
      beforeEach(() => {
        user = new User();
        priority = new Priority();
        priority.idPriority = 'e0a8f072-a3ce-46d9-878a-ab1ffdc0e466';
        priority.name = 'normal';
        query =
          'mutation { updatePriority(idPriority: "96c48076-2d20-4d34-a0df-fe68dbaa338f", name: "normal") { idPriority name } }';
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
        priorityRepositoryMock.findOne.mockResolvedValueOnce(priority);
        priorityRepositoryMock.create.mockResolvedValueOnce(priority);
        priorityRepositoryMock.update.mockRejectedValueOnce({
          message: 'duplicate key value',
          detail: 'name',
        });
      });
      it('mutation updatePriority', async () => {
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
          'nama prioritas sudah digunakan!',
        );
        expect(response.body.data).toBeNull();
      });
    });

    describe('Error internal server error', () => {
      let query: string;
      let user: User;
      let priority: Priority;
      beforeEach(() => {
        user = new User();
        priority = new Priority();
        priority.idPriority = 'e0a8f072-a3ce-46d9-878a-ab1ffdc0e466';
        priority.name = 'normal';
        query =
          'mutation { updatePriority(idPriority: "96c48076-2d20-4d34-a0df-fe68dbaa338f", name: "normal") { idPriority name } }';
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
        priorityRepositoryMock.findOne.mockResolvedValueOnce(priority);
        priorityRepositoryMock.create.mockResolvedValueOnce(priority);
        priorityRepositoryMock.update.mockRejectedValueOnce({
          message: 'internal server error',
          detail: 'error',
        });
      });
      it('mutation updatePriority', async () => {
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
          'Unexpected error value: { message: "internal server error", detail: "error" }',
        );
        expect(response.body.data).toBeNull();
      });
    });
  });

  describe('e2e priorities', () => {
    describe('Success priorities', () => {
      let query: string;
      let user: User;
      let priority: Priority;
      beforeEach(() => {
        user = new User();
        priority = new Priority();
        priority.idPriority = 'e0a8f072-a3ce-46d9-878a-ab1ffdc0e466';
        priority.name = 'normal';
        query = 'query { priorities { idPriority name } }';
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
        priorityRepositoryMock.find.mockResolvedValueOnce([priority]);
      });
      it('mutation priorities', async () => {
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
            priorities: [
              {
                idPriority: 'e0a8f072-a3ce-46d9-878a-ab1ffdc0e466',
                name: 'normal',
              },
            ],
          },
        });
      });
    });
  });

  describe('e2e createPriority', () => {
    describe('Success createPriority', () => {
      let query: string;
      let user: User;
      let priority: Priority;
      beforeEach(() => {
        user = new User();
        priority = new Priority();
        priority.idPriority = 'e0a8f072-a3ce-46d9-878a-ab1ffdc0e466';
        priority.name = 'normal';
        query =
          'mutation { createPriority(name: "normal" description: "deskripsi testing") { idPriority name } }';
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
        priorityRepositoryMock.create.mockResolvedValueOnce(priority);
        priorityRepositoryMock.save.mockResolvedValueOnce(true);
      });
      it('mutation createPriority', async () => {
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
            createPriority: {
              idPriority: 'e0a8f072-a3ce-46d9-878a-ab1ffdc0e466',
              name: 'normal',
            },
          },
        });
      });
    });

    describe('Error duplikat nama prioritas', () => {
      let query: string;
      let user: User;
      let priority: Priority;
      beforeEach(() => {
        user = new User();
        priority = new Priority();
        priority.idPriority = 'e0a8f072-a3ce-46d9-878a-ab1ffdc0e466';
        priority.name = 'normal';
        query =
          'mutation { createPriority(name: "normal" description: "deskripsi testing") { idPriority name } }';
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
        priorityRepositoryMock.findOne.mockResolvedValueOnce(priority);
        priorityRepositoryMock.create.mockResolvedValueOnce(priority);
        priorityRepositoryMock.save.mockRejectedValueOnce({
          message: 'duplicate key value',
          detail: 'name',
        });
      });
      it('mutation createPriority', async () => {
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
          'nama prioritas sudah digunakan!',
        );
        expect(response.body.data).toBeNull();
      });
    });

    describe('Error internal server error', () => {
      let query: string;
      let user: User;
      let priority: Priority;
      beforeEach(() => {
        user = new User();
        priority = new Priority();
        priority.idPriority = 'e0a8f072-a3ce-46d9-878a-ab1ffdc0e466';
        priority.name = 'normal';
        query =
          'mutation { createPriority(name: "normal" description: "deskripsi testing") { idPriority name } }';
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
        priorityRepositoryMock.findOne.mockResolvedValueOnce(priority);
        priorityRepositoryMock.create.mockResolvedValueOnce(priority);
        priorityRepositoryMock.save.mockRejectedValueOnce({
          message: 'internal server error',
          detail: 'error',
        });
      });
      it('mutation createPriority', async () => {
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
          'Unexpected error value: { message: "internal server error", detail: "error" }',
        );
        expect(response.body.data).toBeNull();
      });
    });
  });
});
