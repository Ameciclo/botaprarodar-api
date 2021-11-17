import express from 'express';
import cors from 'cors';
import * as core from 'express-serve-static-core';
import routes from './controllers';
import bodyParser from 'body-parser';
import { initializeFirebaseApp } from './database/Firebase';

const app: core.Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use(routes);

initializeFirebaseApp();

const APP_PORT = process.env.PORT || 3000;
const server = app.listen(APP_PORT, () => {
  console.log(`Servidor iniciado na porta ${APP_PORT}`);
});

export { app, server };
