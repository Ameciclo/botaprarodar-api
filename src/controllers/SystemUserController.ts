import { Request, Response, Router } from "express";
import SystemUserService from "../services/SystemUserService";
import CreateSystemUserRequest from "../dto/requests/SystemUserDtoRequest";

const systemUserController = Router();

systemUserController.post(
  "/",
  async (request: Request, response: Response): Promise<void> => {
    CreateSystemUserRequest.convertBodyToRequest(request.body)
      .then(async (createUserRequest) => {
        if (await SystemUserService.createUser(createUserRequest)) {
          response.status(200).send();
        } else {
          response.status(400).send("Ja existe um usuario com este e-mail.");
        }
      })
      .catch((err) => {
        response.status(400).send(err);
      });
  }
);

export default systemUserController;
