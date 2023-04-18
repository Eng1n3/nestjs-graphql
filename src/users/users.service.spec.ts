import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let usersService: UsersService;
  let findOne: jest.Mock;
  let create: jest.Mock;
  let save: jest.Mock;
  beforeEach(async () => {
    findOne = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne,
            create,
            save,
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
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

  describe('Membuat user', () => {
    describe('Success membuat user', () => {
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
  });
});
