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
import { graphqlUploadExpress } from 'graphql-upload';

type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

jest.setTimeout(1000000000);

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let pubSub: PubSub;

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
      //   .overrideProvider(PUB_SUB)
      //   .useValue(pubsubMock)
      .overrideProvider(getRepositoryToken(User))
      .useValue(userRepositoryMock)
      .overrideProvider(getRepositoryToken(Project))
      .useValue(projectRepositoryMock)
      .compile();
    app = moduleFixture.createNestApplication();
    app.use(graphqlUploadExpress());
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
});
