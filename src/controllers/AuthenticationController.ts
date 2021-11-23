import { Request, Response, Router } from "express";
import AuthenticationService from "../services/AuthenticationService";

const authenticationController = Router();

authenticationController.post(
  "/",
  async (request: Request, response: Response): Promise<void> => {
    const authenticationResponse = AuthenticationService.signIn(
      request.body.email,
      request.body.password
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
  }
);

export default authenticationController;
