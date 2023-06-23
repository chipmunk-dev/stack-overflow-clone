import * as express from 'express';
import { body, validationResult } from 'express-validator';
import { login } from '../controller/member.controller';

const route = express.Router();

route.post(
  '/login',
  [
    body('id')
      .notEmpty()
      .withMessage('아이디가 비어있습니다.')
      .isEmail()
      .withMessage('아이디는 이메일 형식이여야 합니다.'),
    body('password').notEmpty().withMessage('패스워드가 비어있습니다.'),
    (
      request: express.Request,
      response: express.Response,
      next: express.NextFunction,
    ) => {
      const result = validationResult(request);

      if (result.isEmpty()) {
        return next();
      }

      return response.status(400).json({ errors: result.array() });
    },
  ],
  login,
);

export default route;
