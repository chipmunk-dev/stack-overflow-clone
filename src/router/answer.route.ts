import * as express from 'express';
import { auth } from '../middleware/auth';
import {
  createAnswer,
  deleteAnswer,
  getAnswer,
  getAnswerList,
  updateAnswer,
} from '../controller/answer.controller';

const route = express.Router();

route.post('/', auth, createAnswer);
route.get('/', getAnswerList);
route.get('/:answerId', getAnswer);
route.patch('/:answerId', auth, updateAnswer);
route.delete('/:answerId', auth, deleteAnswer);

export default route;
