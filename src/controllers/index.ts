import { Router } from 'express';
import apiStatusController from './ApiStatusController';
import testeApiFirebase from './TesteApiFirebase';

const routes = Router();

routes.use('/', apiStatusController);
routes.use('/teste', testeApiFirebase);

export default routes;
