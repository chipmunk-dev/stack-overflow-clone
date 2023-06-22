import * as express from 'express';
import { register, withdraw, update } from '../controller/member.controller';

const route = express.Router();

route.post('/signup', register);
route.delete('/:id', withdraw);
route.patch('/:memberId', update);
// route.get('/:memberId');

export default route;
