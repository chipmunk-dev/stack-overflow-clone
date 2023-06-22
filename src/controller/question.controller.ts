import { Request, Response } from 'express';
import { isEmpty } from 'lodash';

import Question from '../data/Question.entity';
import Member from '../data/Member.entity';
import {
  findQuestionById,
  findQuestions,
  removeQuestion,
  saveQuestion,
} from '../repository/question.repo';
import { findMemberById } from '../repository/member.repo';
import { memberToMemberResponseDto } from '../mapper/memberMapper';

export const createQuestion = async (request: Request, response: Response) => {
  const { memberId } = response.locals;
  const { title, content } = request.body;

  try {
    const newQuestion = new Question();
    const findMember = await findMemberById(memberId);

    newQuestion.title = title;
    newQuestion.content = content;
    newQuestion.member = findMember as Member;
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

export const getQuestionList = async (request: Request, response: Response) => {
  const { page, size } = request.query;
  const pagenation = {
    page: page ? Number(page) : 1,
    size: size ? Number(size) : 10,
  };

  try {
    const findQuestionList = (await findQuestions(pagenation)) || [];
    const [questions, totalElements] = findQuestionList;
    const pageInfo = {
      ...pagenation,
      totalElements,
      totalPages: Math.ceil(totalElements / pagenation.size),
    };

    return response.status(200).json({ data: questions, pageInfo: pageInfo });
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
    const memberResponse = memberToMemberResponseDto(
      (findQuestion as Question).member,
    );

    return response
      .status(200)
      .json({ ...findQuestion, member: { ...memberResponse } });
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
