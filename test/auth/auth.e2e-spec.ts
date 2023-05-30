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
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'class-validator';

type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

jest.mock('postmark');

jest.setTimeout(1000000000);

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const pubsubMock: MockType<PubSub> = {
    publish: jest.fn(),
    asyncIterator: jest.fn(),
  };

  const jwtServiceMock: MockType<JwtService> = {
    sign: jest.fn(),
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
      .overrideProvider(JwtService)
      .useValue(jwtServiceMock)
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

  describe('e2e messageForgotUser', () => {
    describe('Success messageForgotUser', () => {
      let query: string;
      beforeEach(() => {
        query = 'mutation { messageForgotUser }';
      });
      it('mutation messageForgotUser', async () => {
        const response = await request(app.getHttpServer())
          .post(gql)
          .send({
            query,
          })
          .expect(200);
        expect(response.body).toEqual({
          data: {
            messageForgotUser:
              'Success kirim email untuk konfirmasi lupa password',
          },
        });
      });
    });
  });

  describe('e2e messageChangePassword', () => {
    describe('Success messageChangePassword', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        query = 'mutation { messageChangePassword }';
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
          data: { messageChangePassword: 'Success change password' },
        });
      });
    });
  });

  describe('e2e messageLoginAdmin', () => {
    describe('Success messageLoginAdmin', () => {
      let query: string;
      beforeEach(() => {
        query = 'mutation { messageLoginAdmin }';
      });
      it('mutation messageRegiterUser', async () => {
        const response = await request(app.getHttpServer())
          .post(gql)
          .send({
            query,
          })
          .expect(200);
        expect(response.body).toEqual({
          data: { messageLoginAdmin: 'Success login admin' },
        });
      });
    });
  });

  describe('e2e messageLoginUser', () => {
    describe('Success messageLoginUser', () => {
      let query: string;
      beforeEach(() => {
        query = 'mutation { messageLoginUser }';
      });
      it('query messageLoginUser', async () => {
        const response = await request(app.getHttpServer())
          .post(gql)
          .send({
            query,
          })
          .expect(200);
        expect(response.body).toEqual({
          data: { messageLoginUser: 'Success login user' },
        });
      });
    });
  });

  describe('e2e refreshToken', () => {
    describe('Success refreshToken', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        query = 'query { refreshToken { token tokenRefresh } }';
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
        jwtServiceMock.sign.mockImplementation((payload, options) => {
          if (isEmpty(options))
            return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A';
          return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP3B';
        });
      });
      it('mutation refreshToken', async () => {
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
            refreshToken: {
              token:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A',
              tokenRefresh:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP3B',
            },
          },
        });
      });
      afterEach(() => {
        jwtServiceMock.sign.mockReset();
      });
    });
  });

  describe('e2e changePassword', () => {
    describe('Success changePassword', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        query =
          'mutation { changePassword(input: {password: "T3sting_password" repassword: "T3sting_password" } ) }';
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
        userRepositoryMock.update.mockResolvedValueOnce(true);
      });
      it('mutation changePassword', async () => {
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
            changePassword: 'Change password success',
          },
        });
      });
      afterEach(() => {
        jwtServiceMock.sign.mockReset();
      });
    });
  });

  describe('e2e forgotUser', () => {
    describe('Success forgotUser', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        user.role = 'user';
        user.email = 'testing@gmail.com';
        query = 'mutation { forgotUser(email: "testing@gmail.com") { email } }';
        userRepositoryMock.findOne.mockResolvedValueOnce(user);
        jwtServiceMock.sign.mockResolvedValueOnce(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP3B',
        );
      });
      it('mutation forgotUser', async () => {
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
          data: { forgotUser: { email: 'testing@gmail.com' } },
        });
      });
      afterEach(() => {
        userRepositoryMock.findOne.mockClear();
        jwtServiceMock.sign.mockReset();
      });
    });

    describe('Error user tidak ditemukan!', () => {
      let query: string;
      beforeEach(() => {
        query = 'mutation { forgotUser(email: "testing@gmail.com") { email } }';
        userRepositoryMock.findOne.mockResolvedValueOnce({});
        jwtServiceMock.sign.mockResolvedValueOnce(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP3B',
        );
      });
      it('mutation forgotUser', async () => {
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
          'User tidak ditemukan!',
        );
        expect(response.body.data).toBeNull();
      });
      afterEach(() => {
        jwtServiceMock.sign.mockReset();
      });
    });
  });

  describe('e2e loginAdmin', () => {
    describe('Success loginAdmin', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        user.idUser = '2bb16d2e-a316-4ced-8f32-94263a3aa7a4';
        user.email = 'testing@gmail.com';
        user.role = 'admin';
        user.password =
          '$2b$10$gHft.TGiPdNA7SzgrSQEq.HhTA/2x.88TUqnOnPufIxckzeEuTE7y';
        query =
          'mutation { loginAdmin(email: "testing@gmail.com" password: "T3sting_password") { token tokenRefresh } }';
        userRepositoryMock.findOne.mockResolvedValueOnce(user);
        jwtServiceMock.sign.mockImplementation((payload, options) => {
          if (isEmpty(options))
            return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A';
          return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP3B';
        });
      });
      it('mutation loginAdmin', async () => {
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
            loginAdmin: {
              token:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A',
              tokenRefresh:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP3B',
            },
          },
        });
      });
      afterEach(() => {
        jwtServiceMock.sign.mockReset();
      });
    });

    describe('Error email atau password salah', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        user.idUser = '2bb16d2e-a316-4ced-8f32-94263a3aa7a4';
        user.email = 'testing@gmail.com';
        user.role = 'admin';
        user.password =
          '$2b$10$gHft.TGiPdNA7SzgrSQEq.HhTA/2x.88TUqnOnPufIxckzeEuTUi9';
        query =
          'mutation { loginAdmin(email: "testing@gmail.com" password: "T3sting_password") { token tokenRefresh } }';
        userRepositoryMock.findOne.mockResolvedValueOnce(user);
        jwtServiceMock.sign.mockImplementation((payload, options) => {
          if (isEmpty(options))
            return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A';
          return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP3B';
        });
      });
      it('mutation loginAdmin', async () => {
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
          'Email atau password salah!',
        );
        expect(response.body.data).toBeNull();
      });
      afterEach(() => {
        jwtServiceMock.sign.mockReset();
      });
    });
  });

  describe('e2e loginUser', () => {
    describe('Success loginUser', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        user.idUser = '2bb16d2e-a316-4ced-8f32-94263a3aa7a4';
        user.email = 'testing@gmail.com';
        user.role = 'user';
        user.password =
          '$2b$10$gHft.TGiPdNA7SzgrSQEq.HhTA/2x.88TUqnOnPufIxckzeEuTE7y';
        query =
          'mutation { loginUser(email: "testing@gmail.com" password: "T3sting_password") { token tokenRefresh } }';
        userRepositoryMock.findOne.mockResolvedValueOnce(user);
        jwtServiceMock.sign.mockImplementation((payload, options) => {
          if (isEmpty(options))
            return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A';
          return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP3B';
        });
      });
      it('mutation loginUser', async () => {
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
            loginUser: {
              token:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A',
              tokenRefresh:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP3B',
            },
          },
        });
      });
      afterEach(() => {
        jwtServiceMock.sign.mockReset();
      });
    });

    describe('Error email atau password salah', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        user.idUser = '2bb16d2e-a316-4ced-8f32-94263a3aa7a4';
        user.email = 'testing@gmail.com';
        user.role = 'user';
        user.password =
          '$2b$10$gHft.TGiPdNA7SzgrSQEq.HhTA/2x.88TUqnOnPufIxckzeEuTUi9';
        query =
          'mutation { loginUser(email: "testing@gmail.com" password: "T3sting_password") { token tokenRefresh } }';
        userRepositoryMock.findOne.mockResolvedValueOnce(user);
        jwtServiceMock.sign.mockImplementation((payload, options) => {
          if (isEmpty(options))
            return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP2A';
          return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIyYmIxNmQyZS1hMzE2LTRjZWQtOGYzMi05NDI2M2EzYWE3YTQiLCJlbWFpbCI6ImFkYW1icmlsaWFuMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MDg0MTA1LCJleHAiOjE2ODUxMTQxMDV9.ZjvD3zPNTFP5v71hp1q4VKCHWo6jR2JDbNRfm0aOP3B';
        });
      });
      it('mutation loginUser', async () => {
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
          'Email atau password salah!',
        );
        expect(response.body.data).toBeNull();
      });
      afterEach(() => {
        jwtServiceMock.sign.mockReset();
      });
    });
  });
});
