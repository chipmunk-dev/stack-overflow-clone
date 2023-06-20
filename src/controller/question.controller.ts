import { Request, Response } from 'express';

import Question from '../data/Question.entity';
import {
  findQuestionById,
  findQuestions,
  removeQuestion,
  saveQuestion,
} from '../repository/question.repo';
import { isEmpty } from 'lodash';

export const createQuestion = async (request: Request, response: Response) => {
  const { memberId } = response.locals;
  const { title, content } = request.body;

  const newQuestion = new Question();

  newQuestion.title = title;
  newQuestion.content = content;
  newQuestion.member = memberId;
  newQuestion.viewCount = 0;

  try {
    const savedQuestion = await saveQuestion(newQuestion);

    return response.status(201).json(savedQuestion);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '서버 에러가 발생했습니다. 잠시 후 다시 요청해주세요.',
      error,
    });
  }
};

export const getQuestionList = async (
  _request: Request,
  response: Response,
) => {
  try {
    const findQuestionList = (await findQuestions()) || [];

    return response.status(200).json({ data: findQuestionList });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '서버 에러가 발생했습니다. 잠시 후 다시 요청해주세요.',
      error,
    });
  }
};

export const getQuestionOne = async (request: Request, response: Response) => {
  const { questionId } = request.params;

  try {
    const findQuestion = await findQuestionById(parseInt(questionId));

    return response.status(200).json(findQuestion);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '서버 에러가 발생했습니다. 잠시 후 다시 요청해주세요.',
      error,
    });
  }
};

export const updateQuestion = async (request: Request, response: Response) => {
  const { questionId } = request.params;
  const { title, content } = request.body;

  try {
    const findQuestion = await findQuestionById(parseInt(questionId));

    if (isEmpty(findQuestion)) {
      return response
        .status(400)
        .json({ message: '올바르지 않은 질문 아이디입니다.' });
    }

    title && (findQuestion.title = title);
    content && (findQuestion.content = content);

    const updateQuestion = await saveQuestion(findQuestion);

    return response.status(200).json(updateQuestion);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '서버 에러가 발생했습니다. 잠시 후 다시 요청해주세요.',
      error,
    });
  }
};

export const deleteQuestion = async (request: Request, response: Response) => {
  const { questionId } = request.params;

  try {
    const findQuestion = await findQuestionById(parseInt(questionId));

    if (isEmpty(findQuestion)) {
      return response
        .status(400)
        .json({ message: '올바르지 않은 질문 아이디입니다.' });
    }

    await removeQuestion(findQuestion);
    return response.sendStatus(204);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '서버 에러가 발생했습니다. 잠시 후 다시 요청해주세요.',
      error,
    });
  }
};
