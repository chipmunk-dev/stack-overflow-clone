import * as express from 'express';
import * as morgan from 'morgan';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import { CorsOptions } from 'cors';
import helmet from 'helmet';

import { AppDataSource } from './db/db';
import authRouter from './router/auth.route';
import memberRouter from './router/member.route';

import 'reflect-metadata';

dotenv.config();

const corsOption: CorsOptions = {
  origin: [process.env.ORIGIN as string],
  methods: ['GET', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(cors(corsOption));
app.use(helmet());
app.use(morgan(process.env.MOARGAN as string));

app.use('/auth', authRouter);
app.use('/members', memberRouter);
app.use(
  (
    error: any,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(error);

    return response.status(500).json({
      message: '서버에러가 발생했습니다. 잠시후 다시 시도해주세요.',
      error,
    });
  },
);

const initializeApp = async () => {
  try {
    await AppDataSource.initialize();
    app.listen(port, () => {
      console.log('connect database...');
      console.log('connect redis server...');
      console.log(`connect server at port number ${port}...`);
    });
  } catch (error) {
    console.error(error);
    throw new Error('Server Error');
  }
};

initializeApp();

export default app;
