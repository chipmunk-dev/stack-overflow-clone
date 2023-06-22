import { DataSource } from 'typeorm';
import 'reflect-metadata';

import Member from '../data/Member.entity';
import Question from '../data/Question.entity';
import Answer from '../data/Answer.entity';

const { PGDATABASE, PGHOST, PGPORT, PGUSER, PGPASSWORD } = process.env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  database: PGDATABASE,
  host: PGHOST,
  port: Number(PGPORT),
  username: PGUSER,
  password: PGPASSWORD,
  entities: [Member, Question, Answer],
  synchronize: true,
  logging: ['query', 'warn', 'error'],
});

export const dataSource = {
  Member: AppDataSource.getRepository(Member),
  Question: AppDataSource.getRepository(Question),
  Answer: AppDataSource.getRepository(Answer),
};
