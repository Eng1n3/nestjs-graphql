import { Seeder } from '@jorgebodega/typeorm-seeding';
import { Priority } from 'src/priority/entities/priority.entity';
import { DataSource } from 'typeorm';
import { v4 as uuid4 } from 'uuid';

export default class PrioritySeeder extends Seeder {
  async run(dataSource: DataSource) {
    const priorities: Pick<Priority, 'idPriority' | 'name' | 'description'>[] =
      [
        {
          idPriority: uuid4(),
          name: 'low',
          description: 'priority for low level',
        },
        {
          idPriority: uuid4(),
          name: 'normal',
          description: 'priority for normal level',
        },
        {
          idPriority: uuid4(),
          name: 'high',
          description: 'priority for high level',
        },
        {
          idPriority: uuid4(),
          name: 'immediate',
          description: 'priority for immediate level',
        },
      ];
    const value = dataSource
      .createEntityManager()
      .getRepository(Priority)
      .create(priorities);
    await dataSource.createEntityManager().save<Priority>(value);
  }
}
