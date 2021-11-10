import express from 'express';
import cors from 'cors';
import * as core from 'express-serve-static-core';
import routes from './controllers';

const app: core.Express = express();

app.use(cors());
app.use(routes);

const APP_PORT = process.env.PORT || 3000;
app.listen(APP_PORT, () => {
  console.log(`Servidor iniciado na porta ${APP_PORT}`);
});
