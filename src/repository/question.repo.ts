import Question from '../data/Question.entity';
import { dataSource } from '../db/db';

const memberResource = dataSource.Question;

export const saveQuestion = async (newQuestion: Question) => {
  return await memberResource.save(newQuestion);
};

export const findQuestions = async (pageInfo: {
  page: number;
  size: number;
}) => {
  const { page, size } = pageInfo;
  return await memberResource.findAndCount({
    take: size,
    skip: (page - 1) * size,
  });
};

export const findQuestionById = async (questionId: number) => {
  return await memberResource.findOne({
    where: { questionId },
    relations: ['answers', 'member'],
  });
};

export const removeQuestion = async (question: Question) => {
  await memberResource.remove(question);
};
