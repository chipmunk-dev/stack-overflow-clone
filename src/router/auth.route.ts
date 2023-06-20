import * as express from 'express';
import { login } from '../controller/member.controller';

const route = express.Router();

route.post('/login', login);

export default route;
