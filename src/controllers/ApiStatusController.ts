import { Request, Response, Router } from 'express';

const apiStatusController = Router();

apiStatusController.get('/', (request: Request, response: Response): void => {
  response.send('O servidor esta rodando...');
});

export default apiStatusController;
