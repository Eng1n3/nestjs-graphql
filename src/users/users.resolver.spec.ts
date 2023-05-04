import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  const usersServiceMock: MockType<UsersService> = {
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
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
        console.log(result, 19);
      });
    });
  });
});
