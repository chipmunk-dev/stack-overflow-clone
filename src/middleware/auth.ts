import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { isEmpty } from 'lodash';
import { typeGuard } from '../util/typeGuard';
import Member from '../data/Member.entity';
import { findMemberById } from '../repository/member.repo';

export const auth = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authorization = request.headers.authorization;
  const accessToken = authorization?.split('Bearer ')[1];

  if (!accessToken) {
    return response.status(401).json({ message: 'token이 없습니다.' });
  }

  try {
    const decoded = verify(accessToken, process.env.ACCESS_KEY as string);
    if (!isEmpty(decoded) && typeGuard<Member>(decoded, 'memberId')) {
      const { memberId } = decoded;
      const findMember = await findMemberById(memberId);

      if (isEmpty(findMember)) {
        return response
          .status(403)
          .json({ message: '유효하지 않은 Token입니다.' });
      }

      response.locals.memberId = memberId;
      return next();
    }

    return response.status(403).json({ message: '유효하지 않은 Token입니다.' });
  } catch (error) {
    if (typeGuard<{ name: string }>(error, 'name')) {
      if (error.name === 'TOKEN_EXPIRED') {
        return response.status(401).json({ error, errorCode: error.name });
      } else {
        return response.status(401).json({ error, errorCode: error.name });
      }
    }
  }
};
