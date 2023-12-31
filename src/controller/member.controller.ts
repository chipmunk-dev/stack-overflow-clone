import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import Member from '../data/Member.entity';
import { MemberStatus } from '../data/common/enum';
import {
  findMemberByEmail,
  findMemberById,
  removeMember,
  saveMember,
} from '../repository/member.repo';
import { memberToMemberResponseDto } from '../mapper/memberMapper';
import { isEmpty } from 'lodash';

export const register = async (request: Request, response: Response) => {
  const { email, password: plainPassword, name } = request.body;

  try {
    const findMember = await findMemberByEmail(email);

    if (!isEmpty(findMember)) {
      return response
        .status(409)
        .json({ message: '이미 존재하는 이메일입니다.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(plainPassword, salt);
    const newMember = new Member();
    newMember.email = email;
    newMember.password = password;
    newMember.name = name;
    newMember.status = MemberStatus.MEMBER_ACTIVE;

    const savedMember = await saveMember(newMember);
    const responseMemberData = memberToMemberResponseDto(savedMember);

    // Token 생성
    const accessToken = jwt.sign(
      responseMemberData,
      process.env.ACCESS_KEY as string,
    );
    const refreshToken = jwt.sign(
      { memberId: responseMemberData.memberId },
      process.env.REFRESH_KEY as string,
    );

    return response
      .status(201)
      .json({ member: responseMemberData, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '서버 에러가 발생했습니다. 잠시 후 다시 요청해주세요.',
      error,
    });
  }
};

export const login = async (request: Request, response: Response) => {
  const { email, password } = request.body;

  try {
    const findMember = await findMemberByEmail(email);

    if (isEmpty(findMember)) {
      return response
        .status(400)
        .json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }

    const isMatch = bcrypt.compare(password, findMember.password);

    if (!isMatch) {
      return response
        .status(400)
        .json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }

    const responseMemberData = memberToMemberResponseDto(findMember);

    // Token 생성
    const accessToken = jwt.sign(
      responseMemberData,
      process.env.ACCESS_KEY as string,
    );
    const refreshToken = jwt.sign(
      { memberId: responseMemberData.memberId },
      process.env.REFRESH_KEY as string,
    );

    response.cookie('authorization', accessToken);

    return response
      .status(200)
      .json({ member: responseMemberData, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '서버 에러가 발생했습니다. 잠시 후 다시 요청해주세요.',
      error,
    });
  }
};

export const checkMember = async (request: Request, response: Response) => {
  const { id } = request.params;

  try {
    const findMember = await findMemberById(parseInt(id));

    if (isEmpty(findMember)) {
      return response
        .status(400)
        .json({ message: '존재하지 않는 회원입니다.' });
    }

    const memberResponseDto = memberToMemberResponseDto(findMember);
    return response.status(200).json(memberResponseDto);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '서버 에러가 발생했습니다. 잠시 후 다시 요청해주세요.',
      error,
    });
  }
};

export const update = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { name, email, password } = request.body;

  try {
    const findMember = await findMemberById(parseInt(id));

    if (isEmpty(findMember)) {
      return response
        .status(400)
        .json({ message: '존재하지 않는 회원입니다.' });
    }

    findMember.name = name;
    findMember.email = email;
    findMember.password = password;

    const updateMember = await saveMember(findMember);
    const memberResponseDto = memberToMemberResponseDto(updateMember);

    return response.status(200).json(memberResponseDto);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '서버 에러가 발생했습니다. 잠시 후 다시 요청해주세요.',
      error,
    });
  }
};

export const withdraw = async (request: Request, response: Response) => {
  const { id } = request.params;

  try {
    const findMember = await findMemberById(parseInt(id));

    if (isEmpty(findMember)) {
      return response.status(400).json({
        message: '해당 멤버가 존재하지 않습니다. 멤버 아이디를 확인해 주세요',
      });
    }

    await removeMember(findMember);
    return response.sendStatus(204);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '서버 에러가 발생했습니다. 잠시 후 다시 요청해주세요.',
      error,
    });
  }
};
