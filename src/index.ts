import { Request, Response } from 'express';
import app from './app';

app.get('/', (req: Request, res: Response): void => {
  res.send('O servidor ta on!');
});

const APP_PORT = process.env.PORT || 3000;
app.listen(APP_PORT, () => {
  console.log(`Servidor iniciado na porta ${APP_PORT}`);
});
