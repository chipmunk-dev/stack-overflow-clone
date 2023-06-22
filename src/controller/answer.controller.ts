import { Request, Response } from 'express';
import Answer from '../data/Answer.entity';
import Member from '../data/Member.entity';
import Question from '../data/Question.entity';
import { findQuestionById } from '../repository/question.repo';
import { findMemberById } from '../repository/member.repo';
import {
  findAnswerById,
  findAnswers,
  removeAnswer,
  saveAnswer,
} from '../repository/answer.repo';
import { memberToMemberResponseDto } from '../mapper/memberMapper';

export const createAnswer = async (request: Request, response: Response) => {
  const { memberId } = response.locals;
  const { questionId, content } = request.body;

  try {
    const findMember = await findMemberById(memberId);
    const findQuestion = await findQuestionById(questionId);
    const newAnswer = new Answer();

    newAnswer.content = content;
    newAnswer.member = findMember as Member;
    newAnswer.question = findQuestion as Question;

    const savedAnswer = await saveAnswer(newAnswer);

    return response.status(201).json(savedAnswer);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '서버 에러가 발생했습니다. 잠시 후 다시 요청해주세요.',
      error,
    });
  }
};

export const getAnswerList = async (request: Request, response: Response) => {
  const { page, size } = request.query;
  const pagenation = {
    page: page ? Number(page) : 1,
    size: size ? Number(size) : 10,
  };

  try {
    const answerList = (await findAnswers(pagenation)) || [];
    const [answers, totalElements] = answerList;
    const pageInfo = {
      ...pagenation,
      totalElements,
      totalPages: Math.ceil(totalElements / pagenation.size),
    };

    return response.status(200).json({ data: answers, pageInfo });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '서버 에러가 발생했습니다. 잠시 후 다시 요청해주세요.',
      error,
    });
  }
};

export const updateAnswer = async (request: Request, response: Response) => {
  const { answerId } = request.params;
  const { content } = request.body;

  try {
    const findAnswer = (await findAnswerById(parseInt(answerId))) as Answer;
    findAnswer.content = content;

    const updateAnswer = await saveAnswer(findAnswer);
    const responseMember = memberToMemberResponseDto(updateAnswer.member);

    return response
      .status(200)
      .json({ ...updateAnswer, member: { ...responseMember } });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '서버 에러가 발생했습니다. 잠시 후 다시 요청해주세요.',
      error,
    });
  }
};

export const deleteAnswer = async (request: Request, response: Response) => {
  const { answerId } = request.params;

  try {
    const findAnswer = (await findAnswerById(parseInt(answerId))) as Answer;
    await removeAnswer(findAnswer);

    return response.sendStatus(204);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '서버 에러가 발생했습니다. 잠시 후 다시 요청해주세요.',
      error,
    });
  }
};
