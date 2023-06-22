import * as express from 'express';
import {
  register,
  withdraw,
  update,
  checkMember,
} from '../controller/member.controller';
import { auth } from '../middleware/auth';

const route = express.Router();

route.post('/signup', register);
route.delete('/:id', auth, withdraw);
route.patch('/:memberId', auth, update);
route.get('/:memberId', checkMember);

export default route;
