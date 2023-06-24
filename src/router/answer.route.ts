import * as express from 'express';
import { auth } from '../middleware/auth';
import {
  createAnswer,
  deleteAnswer,
  getAnswerList,
  updateAnswer,
} from '../controller/answer.controller';

const route = express.Router();

route.post('/', auth, createAnswer);
route.get('/', getAnswerList);
route.patch('/:answerId', auth, updateAnswer);
route.delete('/:answerId', auth, deleteAnswer);

export default route;
