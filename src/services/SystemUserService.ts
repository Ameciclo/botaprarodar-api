import { CreateSystemUserRequest } from '../dto/requests/SystemUserDtoRequest';
import { SystemUserMapper } from '../mapper/SystemUserMapper';
export class SystemUserService {
  public static createUser = async (
    body: CreateSystemUserRequest
  ): Promise<boolean> => {
    const userExists = await SystemUserMapper.userExistsByEmail(
      body.emailNewUser
    );

    if (userExists) {
      return false;
    } else {
      SystemUserMapper.insertSystemUser(
        body.emailNewUser,
        body.passwordNewUser,
        body.typeNewUser
      );

      return SystemUserMapper.userExistsByEmail(body.emailNewUser);
    }
  };
}
