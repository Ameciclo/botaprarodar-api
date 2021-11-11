import express from 'express';
import cors from 'cors';
import * as core from 'express-serve-static-core';
import routes from './controllers';
import bodyParser from 'body-parser';

const app: core.Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use(routes);

const APP_PORT = process.env.PORT || 3000;
const server = app.listen(APP_PORT, () => {
//server = app.listen(APP_PORT, () => {
  console.log(`Servidor iniciado na porta ${APP_PORT}`);
});

//
app.get('/quit', function(req,res) {
  res.send('closing..');
  server.close();
});
//

export default app;
