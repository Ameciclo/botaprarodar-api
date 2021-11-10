import express from 'express';
import cors from 'cors';
import * as core from 'express-serve-static-core';
import { Request, Response } from 'express';

const app: core.Express = express();

app.use(cors());

app.get('/', (req: Request, res: Response): void => {
  res.send('O servidor ta on!');
});

const APP_PORT = process.env.PORT || 3000;
app.listen(APP_PORT, () => {
  console.log(`Servidor iniciado na porta ${APP_PORT}`);
});
