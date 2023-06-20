import { DataSource } from 'typeorm';
import * as path from 'path';
import 'reflect-metadata';

import Member from '../data/Member.entity';
import Question from '../data/Question.entity';
import Answer from '../data/Answer.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  entities: [path.join(__dirname, '..', 'data', '*.entity.ts')],
  synchronize: true,
  logging: ['query', 'warn', 'error'],
});

export const dataSource = {
  Member: AppDataSource.getRepository(Member),
  Question: AppDataSource.getRepository(Question),
  Answer: AppDataSource.getRepository(Answer),
};
