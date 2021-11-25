import CreateSystemUserRequest from "../dto/requests/SystemUserDtoRequest";
import SystemUserMapper from "../mapper/SystemUserMapper";
import ESystemUserType from "../models/ESystemUserType";
import ServiceResponse from "../models/ServiceResponse";
import EmailService from "./EmailService";

export default class SystemUserService {
  public static createUser = async (
    body: CreateSystemUserRequest
  ): Promise<ServiceResponse<unknown>> => {
    const response = new ServiceResponse();
    const userExists = await SystemUserMapper.userExistsByEmail(
      body.emailNewUser
    );
    const isCurrentUserAdmin = await this.isUserAdmin(body.emailCurrentUser);

    if (userExists) {
      response.errorMessages.push("Usuario ja existe.");
      return response;
    }
    if (!isCurrentUserAdmin) {
      response.errorMessages.push("Usuario atual nao e administrador.");
      return response;
    }
    const randomPasswordCreated = await SystemUserMapper.insertSystemUser(
      body.emailNewUser,
      body.typeNewUser
    );

    const newUserWasCreated = await SystemUserMapper.userExistsByEmail(
      body.emailNewUser
    );

    if (!newUserWasCreated) {
      response.errorMessages.push("Nao foi possivel criar o usuario.");
    } else {
      await SystemUserService.sendEmailConfirmation(
        body.emailNewUser,
        randomPasswordCreated
      );
    }

    return response;
  };

  private static isUserAdmin = async (email: string): Promise<boolean> => {
    const user = await SystemUserMapper.getUserByEmail(email);

    return user?.type === ESystemUserType.admin;
  };

  public static sendEmailConfirmation = async (
    userEmail: string,
    userPassword: string
  ): Promise<void> => {
    const subject = "Bem vindo(a) ao Bota Pra Rodar!";
    const htmlBody = `
    <h3>Olá, bem vindo(a)!</h3>
    <p>Obrigada por se registrar no sistema do Bota pra Rodar. 🚲🚲🚲</p>
    
    <p>Você pode acessar o sistema <a href='https://botaprarodar.netlify.app/'>Bota Pra Rodar - Web</a> 
com sua senha de acesso temporária: ${userPassword}</p>
    <p>Solicitamos que altere sua senha em seu primeiro acesso.</p>

    <p>Em caso de problemas de acesso, entrar em contato com: contato@ameciclo.org</p>

    <p>Favor não responder a este e-mail.</p>

    <p>Obrigada por nos ajudar neste projeto!</p> `;

    await EmailService.sendEmail([userEmail], subject, htmlBody);
  };

  public static updatePassword = async (
    email: string,
    newPassword: string
  ): Promise<ServiceResponse<unknown>> => {
    const response = new ServiceResponse<unknown>();

    await SystemUserMapper.updateSystemUserPassword(email, newPassword).catch(
      (error) => {
        response.errorMessages.push(error.message);
      }
    );

    return response;
  };
}
