import { Request, Response, Router } from "express";
import AuthenticationRequest from "../dto/requests/AuthenticationDtoRequest";
import AuthenticationService from "../services/AuthenticationService";

const authenticationController = Router();

authenticationController.post(
  "/",
  async (request: Request, response: Response): Promise<void> => {
    try {
      const authenticationRequest =
        await AuthenticationRequest.convertBodyToRequest(request.body);

      const authenticationResponse = AuthenticationService.signIn(
        authenticationRequest.email,
        authenticationRequest.password
      );

      if ((await authenticationResponse).success()) {
        response.status(200).json({
          auth: true,
          token: (await authenticationResponse).returnValue,
        });
      } else {
        response
          .status(400)
          .send((await authenticationResponse).errorMessages.join(", "));
      }
    } catch (err) {
      response.status(400).send(err);
    }
  }
);

export default authenticationController;
