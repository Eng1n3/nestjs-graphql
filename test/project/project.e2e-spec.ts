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
import * as fs from 'fs';
import { Priority } from 'src/priority/entities/priority.entity';
import { DocumentEntity } from 'src/document/entities/document.entity';

type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

jest.setTimeout(1000000000);

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const pubsubMock: MockType<PubSub> = {
    publish: jest.fn(),
    asyncIterator: jest.fn(),
  };

  const documentRepositoryMock: MockType<Repository<DocumentEntity>> = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const priorityRepositoryMock: MockType<Repository<Priority>> = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const projectRepositoryMock: MockType<Repository<Project>> = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
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
      .overrideProvider(getRepositoryToken(DocumentEntity))
      .useValue(documentRepositoryMock)
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

  describe('e2e messageDeleteProject', () => {
    describe('Success messageDeleteProject', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        query = 'mutation { messageDeleteProject }';
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
      it('mutation messageDeleteProject', async () => {
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
          data: { messageDeleteProject: 'Success delete project' },
        });
      });
    });
  });

  describe('e2e messageUpdateProject', () => {
    describe('Success messageUpdateProject', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        query = 'mutation { messageUpdateProject }';
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
          data: { messageUpdateProject: 'Success update project' },
        });
      });
    });
  });

  describe('e2e messageCreateProject', () => {
    describe('Success messageCreateProject', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        query = 'mutation { messageCreateProject }';
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
          data: { messageCreateProject: 'Success buat project' },
        });
      });
    });
  });

  describe('e2e messageProject', () => {
    describe('Success messageProject', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        query = 'query { messageProject }';
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
      it('query messageProject', async () => {
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
          data: { messageProject: 'Success mendapatkan data project' },
        });
      });
    });
  });

  describe('e2e countProjectAdmin', () => {
    describe('Success countProjectAdmin', () => {
      let query: string;
      let user: User;
      let total: number;
      beforeEach(() => {
        total = 1;
        user = new User();
        query = 'query { countProjectAdmin }';
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
        projectRepositoryMock.count.mockResolvedValueOnce(total);
      });
      it('query countProjectAdmin', async () => {
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
          data: { countProjectAdmin: 1 },
        });
      });
    });
  });

  describe('e2e countProjectUser', () => {
    describe('Success countProjectUser', () => {
      let query: string;
      let user: User;
      let total: number;
      beforeEach(() => {
        total = 1;
        user = new User();
        query = 'query { countProjectUser }';
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
        projectRepositoryMock.count.mockResolvedValueOnce(total);
      });
      it('query countProjectUser', async () => {
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
          data: { countProjectUser: 1 },
        });
      });
    });
  });

  describe('e2e yearProject', () => {
    describe('Success yearProject', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        user.createdAt = '2011-01-01' as unknown as Date;
        query = 'query { yearProject(limit: 1) { id year } }';
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
        projectRepositoryMock.findOne.mockResolvedValueOnce(user);
      });
      it('query yearProject', async () => {
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
          data: { yearProject: [{ id: 2011, year: 2011 }] },
        });
      });
    });
  });

  describe('e2e countProjectByDate', () => {
    describe('Success countProjectByDate', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        user.createdAt = '2023-01-23' as unknown as Date;
        query = 'query { countProjectByDate(year: 2023) { date count } }';
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
        projectRepositoryMock.createQueryBuilder.mockImplementationOnce(() => {
          const fnQuery = {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            having: jest.fn().mockReturnThis(),
            execute: jest
              .fn()
              .mockResolvedValueOnce([{ date: '2023-01', count: 1 }]),
          };
          return fnQuery;
        });
      });
      it('query countProjectByDate', async () => {
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
            countProjectByDate: [
              { date: 'Jan 23', count: 1 },
              { date: 'Feb 23', count: 0 },
              { date: 'Mar 23', count: 0 },
              { date: 'Apr 23', count: 0 },
              { date: 'May 23', count: 0 },
              { date: 'Jun 23', count: 0 },
              { date: 'Jul 23', count: 0 },
              { date: 'Aug 23', count: 0 },
              { date: 'Sep 23', count: 0 },
              { date: 'Oct 23', count: 0 },
              { date: 'Nov 23', count: 0 },
              { date: 'Dec 23', count: 0 },
            ],
          },
        });
      });
    });
  });

  describe('e2e deleteProject', () => {
    describe('Success', () => {
      let query: string;
      let user: User;
      let project: Project;
      beforeEach(() => {
        user = new User();
        project = new Project();
        project.idProject = '2bb16d2e-a316-4ced-8f32-94263a3aa7v3';
        project.projectName = 'project testing';
        project.description = 'project testing description';
        query =
          'mutation { deleteProject(idProject: "2bb16d2e-a316-4ced-8f32-94263a3aa7v3") { projectName description } }';
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
        projectRepositoryMock.findOne.mockResolvedValueOnce(project);
        jest.spyOn(fs, 'rmSync').mockImplementationOnce(() => {
          true;
        });
      });
      it('mutation deleteProject', async () => {
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
            deleteProject: {
              projectName: 'project testing',
              description: 'project testing description',
            },
          },
        });
      });
    });

    describe('error project tidak ditemukan', () => {
      let query: string;
      let user: User;
      let project: Project;
      beforeEach(() => {
        user = new User();
        project = new Project();
        project.idProject = '2bb16d2e-a316-4ced-8f32-94263a3aa7v3';
        project.projectName = 'project testing';
        project.description = 'project testing description';
        query =
          'mutation { deleteProject(idProject: "2bb16d2e-a316-4ced-8f32-94263a3aa7v3") { projectName description } }';
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
        projectRepositoryMock.findOne.mockResolvedValueOnce(null);
      });
      it('mutation deleteProject', async () => {
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
          'Project tidak ditemukan!',
        );
        expect(response.body.data).toBeNull();
      });
    });
  });

  describe('e2e updateProject', () => {
    describe('Success updateProject', () => {
      let query: string;
      let user: User;
      let project: Project;
      beforeEach(() => {
        project = new Project();
        project.projectName = 'project testing';
        project.description = 'project testing description';
        user = new User();
        query =
          'mutation { updateProject(input: { idProject: "2bb16d2e-a316-4ced-8f32-94263a3aa7v3" projectName: "Project testing update" }) { projectName description } }';
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
        projectRepositoryMock.findOne.mockResolvedValueOnce(project);
        project.projectName = 'project testing update';
        projectRepositoryMock.create.mockReturnValueOnce(project);
        projectRepositoryMock.update.mockResolvedValueOnce(true);
      });
      it('mutation updateProject', async () => {
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
            updateProject: {
              projectName: 'project testing update',
              description: 'project testing description',
            },
          },
        });
      });
    });

    describe('error project tidak ditemukan', () => {
      let query: string;
      let user: User;
      let project: Project;
      let priority: Priority;
      beforeEach(() => {
        project = new Project();
        priority = new Priority();
        project.projectName = 'project testing';
        project.description = 'project testing description';
        user = new User();
        query =
          'mutation { updateProject(input: { idProject: "2bb16d2e-a316-4ced-8f32-94263a3aa7v3" projectName: "Project testing update" idPriority: "2bb16d2e-a316-4ced-8f32-94263a3aa7b9" }) { projectName description } }';
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
        projectRepositoryMock.findOne.mockResolvedValueOnce(null);
        priorityRepositoryMock.findOneBy.mockResolvedValueOnce(priority);
      });
      it('mutation updateProject', async () => {
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
          'Project tidak ditemukan!',
        );
        expect(response.body.data).toBeNull();
      });
    });

    describe('error prioritas tidak ditemukan', () => {
      let query: string;
      let user: User;
      let project: Project;
      beforeEach(() => {
        project = new Project();
        project.projectName = 'project testing';
        project.description = 'project testing description';
        user = new User();
        query =
          'mutation { updateProject(input: { idProject: "2bb16d2e-a316-4ced-8f32-94263a3aa7v3" projectName: "Project testing update" idPriority: "2bb16d2e-a316-4ced-8f32-94263a3aa7b9" }) { projectName description } }';
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
        projectRepositoryMock.findOne.mockResolvedValueOnce(project);
        priorityRepositoryMock.findOneBy.mockResolvedValueOnce(null);
      });
      it('mutation updateProject', async () => {
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
          'Priority tidak ditemukan!',
        );
        expect(response.body.data).toBeNull();
      });
    });
  });

  describe('e2e createProject', () => {
    describe('Success createProject', () => {
      let query: string;
      let user: User;
      let project: Project;
      let priority: Priority;
      beforeEach(() => {
        priority = new Priority();
        priority.idPriority = '2bb16d2e-a316-4ced-8f32-94263a3aa7b9';
        project = new Project();
        project.idProject = '2bb16d2e-a316-4ced-8f32-94263a3aa9o0';
        project.projectName = 'project testing';
        project.description = 'project testing description';
        user = new User();
        query =
          'mutation { createProject(input: { projectName: "project testing" description: "project testing description" deadLine: "2023-01-01" idPriority: "2bb16d2e-a316-4ced-8f32-94263a3aa7b9" }) { projectName description } }';
        jest
          .spyOn(jwt, 'verify')
          .mockImplementationOnce((token, secretOrKey, options, callback) =>
            callback(null, {
              idUser: '2bb16d2e-a316-4ced-8f32-94263a3aa7a4',
              email: 'testing@gmail.com',
              role: 'user',
            }),
          );

        jest.spyOn(fs, 'mkdirSync').mockImplementationOnce(() => {
          return 'true';
        });
        userRepositoryMock.findOne.mockResolvedValueOnce(user);
        projectRepositoryMock.findOne.mockResolvedValueOnce(project);
        priorityRepositoryMock.findOneBy.mockResolvedValueOnce(priority);
        projectRepositoryMock.create.mockReturnValueOnce(project);
        projectRepositoryMock.save.mockResolvedValueOnce(true);
      });
      it('mutation createProject', async () => {
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
            createProject: {
              projectName: 'project testing',
              description: 'project testing description',
            },
          },
        });
      });
    });

    describe('error prioritas tidak ditemukan', () => {
      let query: string;
      let user: User;
      let project: Project;
      beforeEach(() => {
        project = new Project();
        project.projectName = 'project testing';
        project.description = 'project testing description';
        user = new User();
        query =
          'mutation { createProject(input: { projectName: "project testing" description: "project testing description" deadLine: "2023-01-01" idPriority: "2bb16d2e-a316-4ced-8f32-94263a3aa7b9" }) { projectName description } }';
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
        projectRepositoryMock.findOne.mockResolvedValueOnce(project);
        priorityRepositoryMock.findOneBy.mockResolvedValueOnce(null);
        projectRepositoryMock.create.mockReturnValueOnce(project);
        projectRepositoryMock.save.mockResolvedValueOnce(true);
      });
      it('mutation createProject', async () => {
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
          'Priority tidak ditemukan!',
        );
        expect(response.body.data).toBeNull();
      });
    });
  });

  describe('e2e project', () => {
    describe('Success project', () => {
      let query: string;
      let user: User;
      let project: Project;
      let document: DocumentEntity;
      beforeEach(() => {
        document = new DocumentEntity();
        document.documentName = 'document testing';
        document.description = 'document testing description';
        project = new Project();
        project.projectName = 'project testing';
        project.description = 'project testing description';
        project.user = new User();
        project.user.idUser = '2bb16d2e-a316-4ced-8f32-94263a3aa7a4';
        user = new User();
        query =
          'query { project { projectName description document { documentName } } }';
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
        projectRepositoryMock.find.mockResolvedValueOnce([project]);
        documentRepositoryMock.find.mockResolvedValueOnce([document]);
      });
      it('query project', async () => {
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
            project: [
              {
                projectName: 'project testing',
                description: 'project testing description',
                document: [
                  {
                    documentName: 'document testing',
                  },
                ],
              },
            ],
          },
        });
      });
    });
  });

  describe('e2e project', () => {
    describe('Success projects', () => {
      let query: string;
      let user: User;
      let project: Project;
      beforeEach(() => {
        project = new Project();
        project.projectName = 'project testing';
        project.description = 'project testing description';
        user = new User();
        query = 'query { projects { projectName description } }';
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
        projectRepositoryMock.find.mockResolvedValueOnce([project]);
      });
      it('query projects', async () => {
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
            projects: [
              {
                projectName: 'project testing',
                description: 'project testing description',
              },
            ],
          },
        });
      });
    });
  });
});
