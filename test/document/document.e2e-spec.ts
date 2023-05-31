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
import { DocumentEntity } from 'src/document/entities/document.entity';
import * as fs from 'fs';

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

  const documentRepositoryMock: MockType<Repository<Document>> = {
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
      .overrideProvider(getRepositoryToken(DocumentEntity))
      .useValue(documentRepositoryMock)
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

  describe('e2e messageDeleteDocument', () => {
    describe('Success messageDeleteDocument', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        query = 'mutation { messageDeleteDocument }';
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
      it('mutation messageDeleteDocument', async () => {
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
          data: { messageDeleteDocument: 'Success delete document' },
        });
      });
    });
  });

  describe('e2e messageUpdateDocument', () => {
    describe('Success messageUpdateDocument', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        query = 'mutation { messageUpdateDocument }';
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
          data: { messageUpdateDocument: 'Success update document' },
        });
      });
    });
  });

  describe('e2e messageUploadDocument', () => {
    describe('Success messageUploadDocument', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        query = 'mutation { messageUploadDocument }';
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
          data: { messageUploadDocument: 'Success upload document' },
        });
      });
    });
  });

  describe('e2e messageDocument', () => {
    describe('Success messageDocument', () => {
      let query: string;
      let user: User;
      beforeEach(() => {
        user = new User();
        query = 'query { messageDocument }';
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
      it('query messageDocument', async () => {
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
          data: { messageDocument: 'Success mendapatkan data document' },
        });
      });
    });
  });

  describe('e2e countDocumentAdmin', () => {
    describe('Success countDocumentAdmin', () => {
      let query: string;
      let user: User;
      let total: number;
      beforeEach(() => {
        total = 1;
        user = new User();
        query = 'query { countDocumentAdmin }';
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
        documentRepositoryMock.count.mockResolvedValueOnce(total);
      });
      it('query countDocumentAdmin', async () => {
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
          data: { countDocumentAdmin: 1 },
        });
      });
    });
  });

  describe('e2e countDocumentUser', () => {
    describe('Success countDocumentUser', () => {
      let query: string;
      let user: User;
      let total: number;
      beforeEach(() => {
        total = 1;
        user = new User();
        query = 'query { countDocumentUser }';
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
        documentRepositoryMock.count.mockResolvedValueOnce(total);
      });
      it('query countDocumentUser', async () => {
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
          data: { countDocumentUser: 1 },
        });
      });
    });
  });

  describe('e2e deleteDocument', () => {
    describe('Success deleteDocument', () => {
      let query: string;
      let user: User;
      let document: DocumentEntity;
      beforeEach(() => {
        user = new User();
        document = new DocumentEntity();
        document.idDocument = 'e574a522-f266-47bf-b9e2-7d19715b15a3';
        document.documentName = 'document testing';
        document.pathDocument = '';
        query =
          'mutation { deleteDocument(idDocument: "e574a522-f266-47bf-b9e2-7d19715b15a3") { idDocument documentName } }';
        jest.spyOn(fs, 'rmSync').mockImplementationOnce((path, options) => {
          true;
        });
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
        documentRepositoryMock.findOne.mockResolvedValueOnce(document);
        documentRepositoryMock.delete.mockResolvedValueOnce(true);
      });
      it('mutation deleteDocument', async () => {
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
            deleteDocument: {
              idDocument: 'e574a522-f266-47bf-b9e2-7d19715b15a3',
              documentName: 'document testing',
            },
          },
        });
      });
    });

    describe('error document tidak ada', () => {
      let query: string;
      let user: User;
      let document: DocumentEntity;
      beforeEach(() => {
        user = new User();
        document = new DocumentEntity();
        document.idDocument = 'e574a522-f266-47bf-b9e2-7d19715b15a3';
        document.documentName = 'document testing';
        document.pathDocument = '';
        query =
          'mutation { deleteDocument(idDocument: "e574a522-f266-47bf-b9e2-7d19715b15a3") { idDocument documentName } }';
        jest.spyOn(fs, 'rmSync').mockImplementationOnce((path, options) => {
          true;
        });
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
        documentRepositoryMock.findOne.mockResolvedValueOnce(null);
        documentRepositoryMock.delete.mockResolvedValueOnce(true);
      });
      it('mutation deleteDocument', async () => {
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
        expect(response.body.errors[0].message).toEqual('Document not found!');
        expect(response.body.data).toBeNull();
      });
    });
  });

  describe('e2e updateDocument', () => {
    describe('Success dengan tanpa document', () => {
      let query: string;
      let user: User;
      let document: DocumentEntity;
      beforeEach(() => {
        user = new User();
        document = new DocumentEntity();
        document.idDocument = 'e574a522-f266-47bf-b9e2-7d19715b15a3';
        document.documentName = 'document testing';
        document.pathDocument = '';
        query =
          'mutation { updateDocument(input: { idDocument: "e574a522-f266-47bf-b9e2-7d19715b15a3" documentName: "document testing update" } ) { idDocument documentName } }';
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
        documentRepositoryMock.findOne.mockResolvedValueOnce(document);
        document.documentName = 'document testing update';
        documentRepositoryMock.create(document);
        documentRepositoryMock.update.mockResolvedValueOnce(true);
      });
      it('mutation updateDocument', async () => {
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
            updateDocument: {
              idDocument: 'e574a522-f266-47bf-b9e2-7d19715b15a3',
              documentName: 'document testing update',
            },
          },
        });
      });
    });
  });

  describe('e2e document', () => {
    describe('Success', () => {
      let query: string;
      let user: User;
      let document: DocumentEntity;
      beforeEach(() => {
        user = new User();
        document = new DocumentEntity();
        document.idDocument = 'e574a522-f266-47bf-b9e2-7d19715b15a3';
        document.documentName = 'document testing';
        document.pathDocument = '';
        query =
          'query { document(options: {search: ""} ) { idDocument documentName } }';
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
        documentRepositoryMock.find.mockResolvedValueOnce([document]);
      });
      it('query document', async () => {
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
            document: [
              {
                idDocument: 'e574a522-f266-47bf-b9e2-7d19715b15a3',
                documentName: 'document testing',
              },
            ],
          },
        });
      });
    });
  });

  describe('e2e documents', () => {
    describe('Success', () => {
      let query: string;
      let user: User;
      let document: DocumentEntity;
      beforeEach(() => {
        user = new User();
        document = new DocumentEntity();
        document.idDocument = 'e574a522-f266-47bf-b9e2-7d19715b15a3';
        document.documentName = 'document testing';
        document.pathDocument = '';
        query =
          'query { documents(options: {search: ""} ) { idDocument documentName } }';
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
        documentRepositoryMock.find.mockResolvedValueOnce([document]);
      });
      it('query documents', async () => {
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
            documents: [
              {
                idDocument: 'e574a522-f266-47bf-b9e2-7d19715b15a3',
                documentName: 'document testing',
              },
            ],
          },
        });
      });
    });
  });
});
