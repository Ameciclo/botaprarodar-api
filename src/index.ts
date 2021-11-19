import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./controllers";
import initializeFirebaseApp from "./database/Firebase";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(routes);

initializeFirebaseApp();

const APP_PORT = process.env.PORT || 3000;
const server = app.listen(APP_PORT, () => {
  console.warn(`Servidor iniciado na porta ${APP_PORT}`);
});

export { app, server };
