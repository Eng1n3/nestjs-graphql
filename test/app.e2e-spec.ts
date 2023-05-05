import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersResolver } from 'src/users/users.resolver';

type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const usersResolverMock: MockType<UsersResolver> = {
    userCount: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: UsersResolver,
          useValue: usersResolverMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // afterAll(async () => {
  //   await connection.close();
  //   await app.close();
  // });

  const gql = '/graphql';

  describe('e2e countAccount', () => {
    it('query countAccount', () => {
      return request(app.getHttpServer())
        .get(gql)
        .send({
          query: 'query { countAccount }',
        })
        .expect(200)
        .expect((res) => {
          console.log(res, 35);
        });
    });
  });
});
