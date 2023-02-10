import { resolve } from 'path';
import { DataSource } from 'typeorm';

const migrationsPath = resolve(`${__dirname}/migrations/*{.ts,.js}`);
const entitiesPath = resolve(`${__dirname}/../**/**.entity{.ts,.js}`);

const dataSource = new DataSource({
  type: 'sqlite',
  database: 'pocketSafe.sqlite',
  entities: [entitiesPath],
  migrations: [migrationsPath],
  synchronize: true,
  migrationsRun: true,
  migrationsTableName: 'migrations',
});
export default dataSource;
