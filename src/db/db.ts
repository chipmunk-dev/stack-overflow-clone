import { DataSource } from 'typeorm';
import 'reflect-metadata';

import Member from '../data/Member.entity';
import Question from '../data/Question.entity';
import Answer from '../data/Answer.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  database: 'stackoverflow',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '비밀번호 입력하세요',
  entities: [Member, Question, Answer],
  synchronize: true,
  logging: ['query', 'warn', 'error'],
});

export const dataSource = {
  Member: AppDataSource.getRepository(Member),
  Question: AppDataSource.getRepository(Question),
  Answer: AppDataSource.getRepository(Answer),
};
