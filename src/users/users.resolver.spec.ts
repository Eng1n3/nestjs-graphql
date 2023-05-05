import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { ProjectService } from 'src/project/project.service';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { PubSub } from 'graphql-subscriptions';
import { User } from './entities/user.entity';

type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  const usersServiceMock: MockType<UsersService> = {
    count: jest.fn(),
    findAll: jest.fn(),
    findOneByEmail: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  const projectServiceMock: MockType<ProjectService> = {
    yearProject: jest.fn(),
  };

  const pubsubMock: MockType<PubSub> = {
    publish: jest.fn(),
    asyncIterator: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: ProjectService,
          useValue: projectServiceMock,
        },
        {
          provide: PUB_SUB,
          useValue: pubsubMock,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  describe('subscription wsUserDeleted', () => {
    describe('subscription mendelete user', () => {
      it('Success mendelete user', async () => {
        const result = resolver.wsUserDeleted();
        expect(result).toBeUndefined();
      });
    });
  });

  describe('subscription wsUserUpdated', () => {
    describe('subscription mengupdate user', () => {
      it('Success mengupdate user', async () => {
        const result = resolver.wsUserUpdated();
        expect(result).toBeUndefined();
      });
    });
  });

  describe('subscription wsUserAdded', () => {
    describe('subscription menambahkan user', () => {
      it('Success menambahkan user', async () => {
        const result = resolver.wsUserAdded();
        expect(result).toBeUndefined();
      });
    });
  });

  describe('resolver messageDeleteUser', () => {
    describe('message delete user', () => {
      it('Success mendapatkan message delete user', async () => {
        const result = await resolver.messageDeleteUser();
        expect(result).toEqual('Success delete user');
      });
    });
  });

  describe('resolver messageRegistrasiUser', () => {
    describe('message registrasi user', () => {
      it('Success mendapatkan message registrasi user', async () => {
        const result = await resolver.messageRegister();
        expect(result).toEqual('Success registrasi user');
      });
    });
  });

  describe('resolver messageUser', () => {
    describe('message mendapatkan data user', () => {
      it('Success mendapatkan message data user', async () => {
        const result = await resolver.messageUser();
        expect(result).toEqual('Success mendapatkan data user');
      });
    });
  });

  describe('resolver messageUpdateUser', () => {
    describe('message update user', () => {
      it('Success mendapatkan message update user', async () => {
        const result = await resolver.messageUpdateUser();
        expect(result).toEqual('Success update user');
      });
    });
  });

  describe('resolver deleteUser', () => {
    describe('update user', () => {
      let users: User;
      beforeEach(() => {
        users = new User();
        usersServiceMock.deleteUser.mockResolvedValue(users);
      });
      it('Success mendelete user', async () => {
        const result = await resolver.deleteUser('uuid-unit-test');
        expect(result).toEqual(users);
      });
    });
  });

  describe('resolver updateUser', () => {
    describe('update user', () => {
      let users: User;
      beforeEach(() => {
        users = new User();
        usersServiceMock.updateUser.mockResolvedValue(users);
      });
      it('Success update user', async () => {
        const result = await resolver.updateUser(new User(), {
          email: 'unittest@gmail.com',
          birthDay: '1997-01-01',
          password: 'Un1t_test_password',
          repassword: 'Un1t_test_password',
          fullname: 'unit test',
        });
        expect(result).toEqual(users);
      });
    });
  });

  describe('resolver registerUser', () => {
    describe('registrasi user', () => {
      let users: User;
      beforeEach(() => {
        users = new User();
        usersServiceMock.createUser.mockResolvedValue(users);
      });
      it('Success membuat user', async () => {
        const result = await resolver.registerUser({
          email: 'unittest@gmail.com',
          birthDay: '1997-01-01',
          password: 'Un1t_test_password',
          repassword: 'Un1t_test_password',
          fullname: 'unit test',
        });
        expect(result).toEqual(users);
      });
    });
  });

  describe('resolver findOneByEmail', () => {
    describe('Data user', () => {
      let users: User;
      beforeEach(() => {
        users = new User();
        usersServiceMock.findOneByEmail.mockResolvedValue(users);
      });
      it('Success mendapatkan data user', async () => {
        const result = await resolver.findOne({
          email: 'unittest@gmail.com',
        } as User);
        expect(result).toEqual(users);
      });
    });
  });

  describe('resolver mendapatkan data semua user', () => {
    describe('Data semua user', () => {
      let users: User[];
      beforeEach(() => {
        users = [new User()];
        usersServiceMock.findAll.mockResolvedValue(users);
      });
      it('Success mendapatkan semua data user', async () => {
        const result = await resolver.findAll();
        expect(result).toEqual(users);
      });
    });
  });

  describe('resolver menghitung user', () => {
    describe('Menghitung user', () => {
      let total: number;
      beforeEach(() => {
        total = 1;
        usersServiceMock.count.mockResolvedValue(total);
      });
      it('Success menghitung user', async () => {
        const result = await resolver.userCount();
        expect(result).toEqual(total);
      });
    });
  });
});
