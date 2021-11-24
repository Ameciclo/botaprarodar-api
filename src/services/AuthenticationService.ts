import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import SystemUserMapper from "../mapper/SystemUserMapper";
import ServiceResponse from "../models/ServiceResponse";
import EncryptionService from "./EncryptionService";

export default class AuthenticationService {
  public static signIn = async (
    userEmail: string,
    userPassword: string
  ): Promise<ServiceResponse<string>> => {
    const response = new ServiceResponse<string>();
    const user = await SystemUserMapper.getUserByEmail(userEmail);
    if (!user) {
      response.errorMessages.push("Usuario nao existe.");
      return response;
    }
    const match = await EncryptionService.comparePassword(
      userPassword,
      user.password
    );
    if (match) {
      const { id } = user;
      const token = jwt.sign({ id }, process.env.SECRET as Secret, {
        expiresIn: 3600,
      });
      response.returnValue = token;
      return response;
    }
    response.errorMessages.push("Login inválido!");
    return response;
  };

  public static verifyJWT = (
    req: Request,
    res: Response,
    next: NextFunction
    // eslint-disable-next-line consistent-return
  ): Response | void => {
    const token = req.headers["x-access-token"];
    if (!token)
      return res
        .status(401)
        .json({ auth: false, message: "Nenhum token foi enviado." });

    // eslint-disable-next-line consistent-return
    jwt.verify(token as string, process.env.SECRET as string, (err) => {
      if (err)
        return res
          .status(500)
          .json({ auth: false, message: "Falha ao autenticar o token." });

      next();
    });
  };
}
