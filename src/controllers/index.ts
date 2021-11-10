import { Router } from 'express';
import apiStatusController from './ApiStatusController';

const routes = Router();

routes.use('/', apiStatusController);

export default routes;
