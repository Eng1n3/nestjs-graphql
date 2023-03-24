import { registerEnumType } from '@nestjs/graphql';

export enum Sort {
  NULL = '',
  asc = 'asc',
  desc = 'desc',
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(Sort, {
  name: 'Sort',
});
