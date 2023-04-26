/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

jest.mock('bcrypt');

describe('UsersService', () => {
  let usersService: UsersService;
  let findOne: jest.Mock;
  let create: jest.Mock;
  let save: jest.Mock;
  let find: jest.Mock;
  let count: jest.Mock;
  beforeEach(async () => {
    findOne = jest.fn();
    create = jest.fn();
    save = jest.fn();
    find = jest.fn();
    count = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne,
            create,
            save,
            find,
            count,
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  describe('Menghitung total user', () => {
    let total: number;
    beforeEach(() => {
      total = 1;
      count.mockReturnValue(Promise.resolve(total));
    });
    it('Kembalian success', async () => {
      const countUser = await usersService.count();
      expect(countUser).toEqual(total);
    });
  });

  describe('Mendapatkan semua user', () => {
    let user: User[];
    beforeEach(() => {
      user = [new User()];
      find.mockReturnValue(Promise.resolve(user));
    });
    it('Kembalian success', async () => {
      const fetchedUser = await usersService.findAll({});
      expect(fetchedUser).toEqual(user);
    });
  });

  describe('Mendapatkan user dari idUser', () => {
    let user: User;
    beforeEach(() => {
      user = new User();
      findOne.mockReturnValue(Promise.resolve(user));
    });
    it('Kembalian success', async () => {
      const fetchedUser = await usersService.findOneByIdUser('id-user');
      expect(fetchedUser).toEqual(user);
    });
  });

  describe('Mendapatkan user dari email', () => {
    let user: User;
    beforeEach(() => {
      user = new User();
      findOne.mockReturnValue(Promise.resolve(user));
    });
    it('Kembalian success', async () => {
      const fetchedUser = await usersService.findOneByEmail('test@test.com');
      expect(fetchedUser).toEqual(user);
    });
  });

  describe('Mendelete user', () => {
    describe('Success delete user', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        create.mockReturnValue(Promise.resolve(user));
        save.mockReturnValue(Promise.resolve(true));
      });
      it('Kembalian success', async () => {
        const createUser = await usersService.createUser('user', {
          email: 'test@test.com',
          password: 'Sup3rstrong_password',
          repassword: 'Sup3rstrong_password',
          fullname: 'unit tesing',
          birthDay: '2002-03-23',
        });
        expect(createUser).toEqual(user);
      });
    });

    // describe('Duplikat membuat user', () => {
    //   let user: User;
    //   beforeEach(() => {
    //     user = new User();
    //     create.mockReturnValue(
    //       Promise.reject({ message: 'duplicate key value', detail: 'email' }),
    //     );
    //     save.mockReturnValue(Promise.resolve(true));
    //   });
    //   it('Kembalian error', async () => {
    //     await expect(
    //       usersService.createUser('user', {
    //         email: 'test@test.com',
    //         password: 'Sup3rstrong_password',
    //         repassword: 'Sup3rstrong_password',
    //         fullname: 'unit tesing',
    //         birthDay: '2002-03-23',
    //       }),
    //     ).rejects.toThrow();
    //   });
    // });
  });

  describe('Membuat user', () => {
    describe('Success membuat user', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        // jest.spyOn(fs, 'mkdirSync').mockImplementationOnce(() => 'false');
        create.mockReturnValue(Promise.resolve(user));
        save.mockReturnValue(Promise.resolve(true));
      });
      it('Kembalian success', async () => {
        const createUser = await usersService.createUser('user', {
          email: 'test@test.com',
          password: 'Sup3rstrong_password',
          repassword: 'Sup3rstrong_password',
          fullname: 'unit tesing',
          birthDay: '2002-03-23',
        });
        expect(createUser).toEqual(user);
      });
    });

    // describe('Duplikat membuat user', () => {
    //   let user: User;
    //   beforeEach(() => {
    //     user = new User();
    //     jest.spyOn(fs, 'mkdirSync').mockReturnValue('true');
    //     create.mockReturnValue(
    //       Promise.reject({ message: 'duplicate key value', detail: 'email' }),
    //     );
    //     save.mockReturnValue(Promise.resolve(true));
    //   });
    //   it('Kembalian error', async () => {
    //     await expect(
    //       usersService.createUser('user', {
    //         email: 'test@test.com',
    //         password: 'Sup3rstrong_password',
    //         repassword: 'Sup3rstrong_password',
    //         fullname: 'unit tesing',
    //         birthDay: '2002-03-23',
    //       }),
    //     ).rejects.toThrow();
    //   });
    // });
  });
});
