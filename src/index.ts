import express from 'express';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Connect to the database using the DATABASE_URL environment
//   variable injected by Railway
const pool = new pg.Pool({
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

const corsOption: CorsOptions = {
  origin: ['http://localhost:5173'],
  methods: ['GET', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(cors(corsOption));
app.use(morgan(process.env.MOARGAN as string));

app.use('/');
app.get('/', async (req, res) => {
  return res.status(200).json({ success: true });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
