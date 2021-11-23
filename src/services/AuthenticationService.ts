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
}
