import { Router } from 'express';
import apiStatusController from './ApiStatusController';
import systemUserController from './SystemUserController';

const routes = Router();

routes.use('/', apiStatusController);
routes.use('/systemUser', systemUserController);

export default routes;
