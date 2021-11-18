import { CreateSystemUserRequest } from '../dto/requests/SystemUserDtoRequest';
import { SystemUserMapper } from '../mapper/SystemUserMapper';
import { ESystemUserType } from '../models/ESystemUserType';
export class SystemUserService {
  public static createUser = async (
    body: CreateSystemUserRequest
  ): Promise<boolean> => {
    const userExists = await SystemUserMapper.userExistsByEmail(
      body.emailNewUser
    );
    console.log('usuario existe?', userExists);
    if (userExists) {
      console.log('Usuario ja existe');
      return false;
    } else {
      console.log('Usuario nao existe');
      return SystemUserMapper.insertSystemUser(
        body.emailNewUser,
        body.passwordNewUser,
        body.typeNewUser
      );
    }
  };
}
