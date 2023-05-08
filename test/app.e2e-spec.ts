/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersResolver } from 'src/users/users.resolver';
import { Client, Pool } from 'pg';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn().mockImplementationOnce((aa, bb) => {
      console.log(aa);
      console.log(bb);
      console.log(19);
    }),
    end: jest.fn(),
  };
  return {
    // Client: jest.fn(() => mClient),
    Pool: jest.fn().mockReturnValueOnce({
      on: jest.fn().mockImplementationOnce(function (this, event, listener) {
        console.log('Ini di on');
        console.log(event, 31);
        if (event === 'connect') {
          return this;
        }
      }),
      connect: jest.fn().mockResolvedValueOnce({ release: jest.fn() }),
    }) as unknown as Pool,
  };
});
// jest.mock('pg', () => {
//   const mClient = {
//     connect: jest.fn(),
//     query: jest.fn().mockImplementationOnce((aa, bb) => {
//       console.log(aa);
//       console.log(bb);
//       console.log(19);
//     }),
//     end: jest.fn(),
//   };
//   const mockEventEmitter = jest
//     .fn()
//     .mockImplementationOnce(function (this, event, handler) {
//       console.log(event, 52);
//       if (event === 'finish') {
//         handler();
//       }
//       return this;
//     });
//   const mockConnect = jest.fn().mockImplementationOnce(function (this, cb) {
//     cb({ relase: jest.fn() });
//   });
//   return {
//     // Client: jest.fn(() => mClient),
//     Pool: jest
//       .fn()
//       .mockImplementationOnce(function (this, cek1, cek2) {
//         console.log(this, cek1, cek2);
//         return this;
//       })
//       .mockReturnValueOnce({
//         connect: mockConnect,
//         on: mockEventEmitter,
//       }),
//   };
// });
jest.setTimeout(1000000000);

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const usersResolverMock: MockType<UsersResolver> = {
    userCount: jest.fn(),
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
    console.log(41);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: UsersResolver,
          useValue: usersResolverMock,
        },
      ],
    }).compile();
    console.log(51);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const gql = '/graphql';

  describe('e2e countAccount', () => {
    let query: string;
    // let client: any;
    beforeEach(async () => {
      // client = new Client();
      userRepositoryMock.count.mockResolvedValueOnce(1);
      query = 'query { countAccount }';
    });
    it('query countAccount', async () => {
      console.log(65);
      const result = await request(app.getHttpServer()).get(gql).send({
        query,
      });
      console.log(result, 50);
    });
  });
});
