import { Request, Response, Router } from 'express';
import { SystemUserService } from '../services/SystemUserService';
import { CreateSystemUserRequest } from '../dto/requests/SystemUserDtoRequest';

const systemUserController = Router();

systemUserController.post(
  '/',
  async (request: Request, response: Response): Promise<void> => {
    CreateSystemUserRequest.convertBodyToRequest(request.body)
      .then((createUserRequest) => {
        SystemUserService.createUser(createUserRequest);
        response.status(201).send();
      })
      .catch((err) => {
        response.status(400).send(err);
      });
  }
);

export default systemUserController;
