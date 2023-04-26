import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
// import * as fs from 'fs';

jest.mock('bcrypt');
// jest.mock('fs');

describe('UsersService', () => {
  let usersService: UsersService;
  // let findOne: jest.Mock;
  let create: jest.Mock;
  let save: jest.Mock;
  beforeEach(async () => {
    // findOne = jest.fn();
    create = jest.fn();
    save = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            // findOne,
            create,
            save,
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  // describe('Mendapatkan user dari email', () => {
  //   let user: User;
  //   beforeEach(() => {
  //     user = new User();
  //     findOne.mockReturnValue(Promise.resolve(user));
  //   });
  //   it('Kembalian success', async () => {
  //     const fetchedUser = await usersService.findOneByEmail('test@test.com');
  //     expect(fetchedUser).toEqual(user);
  //   });
  // });

  describe('Membuat user', () => {
    describe('Success membuat user', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        create.mockReturnValue(Promise.resolve(user));
        save.mockReturnValue(Promise.resolve(true));
        // const mockmkdirSync = jest.fn().mockReturnValue(true);
        // (fs.mkdirSync as jest.Mock).mockImplementationOnce(mockmkdirSync);
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
  });
});
