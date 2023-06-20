import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import Member from '../data/Member.entity';
import { MemberStatus } from '../data/common/enum';
import { findMemberByEmail, saveMember } from '../repository/member.repo';
import { memberToMemberResponseDto } from '../mapper/memberMapper';
import { isEmpty } from 'lodash';

export const register = async (request: Request, response: Response) => {
  const { email, password: plainPassword, name } = request.body;

  try {
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

    response.cookie('authorization', `Bearer ${accessToken}`);

    return response
      .status(201)
      .json({ member: responseMemberData, refreshToken });
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

    response.cookie('authorization', `Bearer ${accessToken}`);

    return response
      .status(200)
      .json({ member: responseMemberData, refreshToken });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '서버 에러가 발생했습니다. 잠시 후 다시 요청해주세요.',
      error,
    });
  }
};

// export const checkMember = async (request: Request, response: Response) => {};

// export const update = async (request: Request, response: Response) => {};

// export const withdraw = async (request: Request, response: Response) => {};
