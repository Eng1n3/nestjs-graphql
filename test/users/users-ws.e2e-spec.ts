/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { User } from 'src/users/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { Project } from 'src/project/entities/project.entity';
import { PubSub } from 'graphql-subscriptions';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PubsubModule } from 'src/pubsub/pubsub.module';

type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

jest.setTimeout(1000000000);

// async function createNestApp(...gateways): Promise<INestApplication> {
//   const testingModule = await Test.createTestingModule({
//     providers: gateways,
//   }).compile();
//   const app = testingModule.createNestApplication();
//   app.useWebSocketAdapter(new WsAdapter(app) as any);
//   return app;
// }

describe('AppController (e2e)', () => {
  let app: INestApplication;
  // let apolloClient: ApolloServerTestClient;
  let pubSub: PubSub;

  const pubsubMock: MockType<PubsubModule> = {
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

  describe('e2e subscription userDeleted', () => {
    describe('Success userDeleted', () => {
      // const gqlWs = `ws://${app}/${gql}`;
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        user.idUser = '2bb16d2e-a316-4ced-8f32-94263a3aa7a4';
        user.email = 'testing@gmail.com';
        user.role = 'admin';
        query = 'subscription { userDeleted { idUser email } }';
        jest
          .spyOn(jwt, 'verify')
          .mockImplementationOnce((token, secretOrKey, options, callback) =>
            callback(null, {
              idUser: '2bb16d2e-a316-4ced-8f32-94263a3aa7a4',
              email: 'testing@gmail.com',
              role: 'user',
            }),
          );
        // pubsubMock.asyncIterator.mockReturnValueOnce(user);
        // const pubSubMock = {
        //   ...new PubSub(),
        //   pullQueue: [],
        //   pushQueue: [],
        //   running: true,
        //   allSubscribed: null,
        //   eventsArray: ['userDeleted'],
        //   next: jest.fn(),
        // };
      });
      it('subscription userDeleted', async () => {
        console.log(app.getHttpServer());
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

        // console.log(gqlWs, 126);
        console.log(response.body);
      });
    });
  });

  // describe('e2e subscription userUpdated', () => {
  //   describe('Success userUpdated', () => {
  //     let query: string;
  //     let user: User;
  //     beforeEach(() => {
  //       user = new User();
  //       user.idUser = '2bb16d2e-a316-4ced-8f32-94263a3aa7a4';
  //       user.email = 'testing@gmail.com';
  //       user.role = 'admin';
  //       query = 'subscription { userUpdated { idUser email } }';
  //       // jest
  //       //   .spyOn(jwt, 'verify')
  //       //   .mockImplementationOnce((token, secretOrKey, options, callback) =>
  //       //     callback(null, {
  //       //       idUser: '2bb16d2e-a316-4ced-8f32-94263a3aa7a4',
  //       //       email: 'testing@gmail.com',
  //       //       role: 'user',
  //       //     }),
  //       //   );
  //       pubsubMock.asyncIterator.mockReturnValueOnce(user);
  //     });
  //     it('subscription userUpdated', async () => {
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
  //     });
  //   });
  // });

  // describe('e2e subscription userAdded', () => {
  //   describe('Success userAdded', () => {
  //     let query: string;
  //     let user: User;
  //     beforeEach(() => {
  //       user = new User();
  //       user.idUser = '2bb16d2e-a316-4ced-8f32-94263a3aa7a4';
  //       user.email = 'testing@gmail.com';
  //       user.role = 'admin';
  //       query = 'subscription { userAdded { idUser email } }';
  //       // jest
  //       //   .spyOn(jwt, 'verify')
  //       //   .mockImplementationOnce((token, secretOrKey, options, callback) =>
  //       //     callback(null, {
  //       //       idUser: '2bb16d2e-a316-4ced-8f32-94263a3aa7a4',
  //       //       email: 'testing@gmail.com',
  //       //       role: 'user',
  //       //     }),
  //       //   );
  //       pubsubMock.asyncIterator.mockReturnValueOnce(user);
  //     });
  //     it('subscription userAdded', async () => {
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
  //     });
  //   });
  // });
});
