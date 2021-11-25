import { Request, Response, Router } from "express";
import { ValidationError } from "class-validator";
import SystemUserService from "../services/SystemUserService";
import CreateSystemUserRequest from "../dto/requests/SystemUserDtoRequest";
import UpdatePasswordRequest from "../dto/requests/UpdatePasswordDtoRequest";
import AuthenticationService from "../services/AuthenticationService";

const systemUserController = Router();

systemUserController.post(
  "/",
  AuthenticationService.verifyJWT,
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
      .catch((err: ValidationError) => {
        response.status(400).send(err);
      })
      .catch((err: Error) => {
        response.status(500).send(err.message);
      });
  }
);

systemUserController.put(
  "/password",
  AuthenticationService.verifyJWT,
  async (request: Request, response: Response): Promise<void> => {
    try {
      const createUserRequest =
        await UpdatePasswordRequest.convertBodyToRequest(request.body);

      const updatePasswordResponse = await SystemUserService.updatePassword(
        createUserRequest.email,
        createUserRequest.password
      );
      if (updatePasswordResponse.success()) {
        response.status(200).send();
      }
    } catch (err) {
      response.status(400).send(err);
    }
  }
);

export default systemUserController;
