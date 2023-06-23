import * as express from 'express';
import {
  register,
  withdraw,
  update,
  checkMember,
  memberInfo,
} from '../controller/member.controller';
import { auth } from '../middleware/auth';

const route = express.Router();

route.post('/signup', register);
route.delete('/:memberId', auth, withdraw);
route.patch('/:memberId', auth, update);
route.get('/:memberId', checkMember);
route.get('/mypage/:memberId', memberInfo);

export default route;
