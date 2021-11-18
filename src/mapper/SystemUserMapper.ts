import { SystemUser } from '../models/SystemUser';
import { ESystemUserType } from '../models/ESystemUserType';
import { GenericMapper } from './GenericMapper';

const systemUserPath = 'SystemUser';
export abstract class SystemUserMapper {
  private static validate = (json: any): string[] => {
    let erros: string[] = [];

    if (!json.email) {
      erros.push('SystemUser deve conter o campo email.');
    }
    if (!json.type) {
      erros.push('SystemUser deve conter o campo tipo.');
    }
    if (!json.password) {
      erros.push('SystemUser deve conter o campo senha.');
    }
    return erros;
  };

  public static convertJsonToSystemUser = (
    json: any,
    id: string
  ): SystemUser => {
    let systemUser: SystemUser;
    const errorList = this.validate(json);
    if (errorList.length === 0) {
      systemUser = { id, ...json };
      return systemUser;
    } else {
      throw new Error(errorList.join(', '));
    }
  };

  public static convertJsonToSystemUserAll = (json: any): SystemUser[] => {
    let systemUserList: SystemUser[];
    systemUserList = Object.keys(json).map((id) => {
      return this.convertJsonToSystemUser(json[id], id);
    });
    return systemUserList;
  };

  public static userExistsByEmail = async (email: string): Promise<boolean> => {
    if (await this.getUserByEmail(email)) return true;
    else return false;
  };

  public static getUserByEmail = async (
    email: string
  ): Promise<SystemUser | undefined> => {
    const allSystemUsersJson = await GenericMapper.getAll(systemUserPath);
    const allSystemUsers = this.convertJsonToSystemUserAll(allSystemUsersJson);

    return allSystemUsers.find((systemUser) => systemUser.email === email);
  };

  public static insertSystemUser = (
    email: string,
    password: string,
    type: ESystemUserType
  ): void => {
    GenericMapper.insert(systemUserPath, { email, password, type });
  };
}
