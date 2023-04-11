import { Seeder } from '@jorgebodega/typeorm-seeding';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuid4 } from 'uuid';

export default class AdminAccountSeeder extends Seeder {
  async run(dataSource: DataSource) {
    const getSalt = bcrypt.genSaltSync();
    const password = 'Sup3rstrong_password';
    const hashPassword = await bcrypt.hash(password, getSalt);
    const adminUser: Pick<
      User,
      'idUser' | 'email' | 'password' | 'role' | 'pathImage'
    > = {
      idUser: uuid4(),
      email: 'admin@gmail.com',
      password: hashPassword,
      role: 'admin',
      pathImage: 'uploads/default-user.jpg',
    };
    const value = dataSource
      .createEntityManager()
      .getRepository(User)
      .create(adminUser);
    await dataSource.createEntityManager().save<User>(value);
  }
}
