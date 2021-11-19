import { Request, Response, Router } from "express";
import SystemUserService from "../services/SystemUserService";
import CreateSystemUserRequest from "../dto/requests/SystemUserDtoRequest";

const systemUserController = Router();

systemUserController.post(
  "/",
  async (request: Request, response: Response): Promise<void> => {
    CreateSystemUserRequest.convertBodyToRequest(request.body)
      .then(async (createUserRequest) => {
        const responseCreateUser = await SystemUserService.createUser(
          createUserRequest
        );
        if (responseCreateUser.success()) {
          response.status(200).send();
        } else {
          response
            .status(400)
            .send(responseCreateUser.errorMessages.join(", "));
        }
      })
      .catch((err) => {
        response.status(500).send(err);
      });
  }
);

export default systemUserController;
