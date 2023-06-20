import Answer from '../data/Answer.entity';
import { dataSource } from '../db/db';

const answerResource = dataSource.Answer;

export const saveAnswer = async (newAnswer: Answer) => {
  return await answerResource.save(newAnswer);
};

export const findAnswers = async () => {
  return await answerResource.find();
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
