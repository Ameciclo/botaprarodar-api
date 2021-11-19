import CreateSystemUserRequest from "../dto/requests/SystemUserDtoRequest";
import SystemUserMapper from "../mapper/SystemUserMapper";
import ESystemUserType from "../models/ESystemUserType";

export default class SystemUserService {
  public static createUser = async (
    body: CreateSystemUserRequest
  ): Promise<boolean> => {
    const userExists = await SystemUserMapper.userExistsByEmail(
      body.emailNewUser
    );

    const isCurrentUserAdmin = await this.isUserAdmin(body.emailCurrentUser);

    if (userExists || !isCurrentUserAdmin) {
      return false;
    }
    SystemUserMapper.insertSystemUser(
      body.emailNewUser,
      body.passwordNewUser,
      body.typeNewUser
    );

    return SystemUserMapper.userExistsByEmail(body.emailNewUser);
  };

  private static isUserAdmin = async (email: string): Promise<boolean> => {
    const user = await SystemUserMapper.getUserByEmail(email);

    return user?.type === ESystemUserType.admin;
  };
}
