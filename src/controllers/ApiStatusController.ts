import { Request, Response, Router } from "express";

const apiStatusController = Router();

apiStatusController.get("/", (request: Request, response: Response): void => {
  response.send({ message: "O servidor esta rodando..." });
});

export default apiStatusController;
