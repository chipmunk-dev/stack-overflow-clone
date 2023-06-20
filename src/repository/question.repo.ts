import Question from '../data/Question.entity';
import { dataSource } from '../db/db';

const memberResource = dataSource.Question;

export const saveQuestion = async (newQuestion: Question) => {
  return await memberResource.save(newQuestion);
};

export const findQuestions = async () => {
  return await memberResource.find();
};

export const findQuestionById = async (questionId: number) => {
  return await memberResource.findOne({
    where: { questionId },
    relations: ['answers', 'members'],
  });
};

export const removeQuestion = async (question: Question) => {
  await memberResource.remove(question);
};
