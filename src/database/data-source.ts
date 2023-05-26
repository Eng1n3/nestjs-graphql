import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import '../common/config/config.env';
import { join } from 'path';

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: +configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE'),
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  synchronize: false,
  migrations: [join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
  // migrations: ['dist/database/migrations/*{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
