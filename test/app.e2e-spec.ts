/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { Project } from 'src/project/entities/project.entity';
import { DocumentEntity } from 'src/document/entities/document.entity';
import { Priority } from 'src/priority/entities/priority.entity';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';

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

  const repositoryMock: MockType<Repository<User>> = {
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
      .useValue(repositoryMock)
      .overrideProvider(getRepositoryToken(Project))
      .useValue(repositoryMock)
      .overrideProvider(getRepositoryToken(DocumentEntity))
      .useValue(repositoryMock)
      .overrideProvider(getRepositoryToken(Priority))
      .useValue(repositoryMock)
      .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const gql = '/graphql';

  // describe('e2e countAccount', () => {
  //   describe('Success countAccount', () => {
  //     let query: string;
  //     let total: number;
  //     let user: User;
  //     beforeEach(() => {
  //       user = new User();
  //       query = 'query { countAccount }';
  //       total = 1;
  //       jest
  //         .spyOn(jwt, 'verify')
  //         .mockImplementationOnce((token, secretOrKey, options, callback) =>
  //           callback(null, {
  //             idUser: '2bb16d2e-a316-4ced-8f32-94263a3aa7a4',
  //             email: 'admin@gmail.com',
  //             role: 'admin',
  //           }),
  //         );
  //       repositoryMock.findOne.mockResolvedValueOnce(user);
  //       repositoryMock.count.mockResolvedValueOnce(total);
  //     });
  //     it('query countAccount', async () => {
  //       const response = await request(app.getHttpServer())
  //         .post(gql)
  //         .set(
  //           'Authorization',
  //           'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A',
  //         )
  //         .send({
  //           query,
  //         })
  //         .expect(200);

  //       expect(response.body).toEqual({ data: { countAccount: 1 } });
  //     });
  //   });
  // });

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
              email: 'admin@gmail.com',
              role: 'admin',
            }),
          );
        repositoryMock.findOne.mockResolvedValueOnce(user);
        repositoryMock.count.mockResolvedValueOnce(total);
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
    });
  });

  describe('e2e user', () => {
    describe('Success user', () => {
      let query: string;
      let total: number;
      let user: User;
      let project: Project;
      let document: Document;
      let priority: Priority;
      beforeEach(() => {
        user = new User();
        project = new Project();
        project.document = [new DocumentEntity()];
        project.priority = new Priority();
        user.project = [project];
        query = `query { user \n{ \nemail \nrole \nproject(options: { sort: {}, search: "" }) \n{ \nprojectName \npriority { \nname \n} \ndocument { \ndocumentName \n} \n} \n} \n}`;
        total = 1;
        jest
          .spyOn(jwt, 'verify')
          .mockImplementationOnce((token, secretOrKey, options, callback) =>
            callback(null, {
              idUser: '2bb16d2e-a316-4ced-8f32-94263a3aa7a4',
              email: 'adambrilian003@gmail.com',
              role: 'user',
            }),
          );
        repositoryMock.findOne.mockResolvedValueOnce(user);
        repositoryMock.count.mockResolvedValueOnce(total);
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

        console.log(response.body);
        // expect(response.body).toEqual({ data: { countAccount: 1 } });
      });
    });
  });
});
