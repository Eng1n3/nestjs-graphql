import { Test, TestingModule } from '@nestjs/testing';
import { PriorityResolver } from './priority.resolver';

describe('PriorityResolver', () => {
  let resolver: PriorityResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriorityResolver],
    }).compile();

    resolver = module.get<PriorityResolver>(PriorityResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
