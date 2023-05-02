import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CountProjectByDate {
  @Field({ description: 'Tahun dan bulan data proyek' })
  date: string;

  @Field((returns) => Int, {
    description: 'menghitung total projek',
    nullable: true,
    defaultValue: 0,
  })
  count: number;
}
