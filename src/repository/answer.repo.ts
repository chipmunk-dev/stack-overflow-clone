import Answer from '../data/Answer.entity';
import { dataSource } from '../db/db';

const answerResource = dataSource.Answer;

export const saveAnswer = async (newAnswer: Answer) => {
  return await answerResource.save(newAnswer);
};

export const findAnswers = async (pageInfo: { page: number; size: number }) => {
  const { page, size } = pageInfo;
  return await answerResource.findAndCount({
    take: size,
    skip: (page - 1) * size,
  });
};

export const findAnswerById = async (answerId: number) => {
  return await answerResource.findOne({
    where: { answerId },
    relations: ['member', 'question'],
  });
};

export const removeAnswer = async (answer: Answer) => {
  return await answerResource.remove(answer);
};
