import { Router } from 'express';
import apiStatusController from './ApiStatusController';
import systemUserController from './SystemUserController';
import testeApiFirebase from './TesteApiFirebase';

const routes = Router();

routes.use('/', apiStatusController);
routes.use('/teste', testeApiFirebase);
routes.use('/systemUser', systemUserController);

export default routes;
