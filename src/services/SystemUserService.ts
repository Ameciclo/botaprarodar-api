import CreateSystemUserRequest from "../dto/requests/SystemUserDtoRequest";
import SystemUserMapper from "../mapper/SystemUserMapper";
import ESystemUserType from "../models/ESystemUserType";
import ServiceResponse from "../models/ServiceResponse";

export default class SystemUserService {
  public static createUser = async (
    body: CreateSystemUserRequest
  ): Promise<ServiceResponse> => {
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
    SystemUserMapper.insertSystemUser(
      body.emailNewUser,
      body.passwordNewUser,
      body.typeNewUser
    );

    const newUserWasCreated = await SystemUserMapper.userExistsByEmail(
      body.emailNewUser
    );

    if (!newUserWasCreated) {
      response.errorMessages.push("Nao foi possivel criar o usuario.");
    }

    return response;
  };

  private static isUserAdmin = async (email: string): Promise<boolean> => {
    const user = await SystemUserMapper.getUserByEmail(email);

    return user?.type === ESystemUserType.admin;
  };
}
