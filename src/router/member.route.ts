import * as express from 'express';
import { register, withdraw } from '../controller/member.controller';

const route = express.Router();

route.post('/signup', register);
route.delete('/:id', withdraw);
// route.get('/:memberId');
// route.patch('/:memberId');
route.delete('/:memberId');

export default route;
