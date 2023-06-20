import * as express from 'express';
import {
  createQuestion,
  deleteQuestion,
  getQuestionList,
  getQuestionOne,
  updateQuestion,
} from '../controller/question.controller';
import { auth } from '../middleware/auth';

const route = express.Router();

route.post('/', auth, createQuestion);
route.get('/', getQuestionList);
route.get('/:questionId', getQuestionOne);
route.patch('/:questionId', auth, updateQuestion);
route.delete('/:questionId', auth, deleteQuestion);

export default route;
