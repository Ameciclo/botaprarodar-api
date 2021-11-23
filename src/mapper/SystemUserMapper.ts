import { SystemUser } from "../models/SystemUser";
import ESystemUserType from "../models/ESystemUserType";
import GenericMapper from "./GenericMapper";
import EncryptionService from "../services/EncryptionService";

const systemUserPath = "SystemUser";
export default abstract class SystemUserMapper {
  private static validate = (json: any): string[] => {
    const erros: string[] = [];

    if (!json.email) {
      erros.push("SystemUser deve conter o campo email.");
    }
    if (!json.type) {
      erros.push("SystemUser deve conter o campo tipo.");
    }
    return erros;
  };

  private static convertJsonToSystemUser = (
    json: any,
    id: string
  ): SystemUser => {
    let systemUser: SystemUser;
    const errorList = this.validate(json);
    if (errorList.length === 0) {
      systemUser = { id, ...json };
      return systemUser;
    }
    throw new Error(errorList.join(", "));
  };

  private static convertJsonToSystemUserAll = (json: any): SystemUser[] => {
    const systemUserList: SystemUser[] = Object.keys(json).map((id) =>
      this.convertJsonToSystemUser(json[id], id)
    );
    return systemUserList;
  };

  public static userExistsByEmail = async (email: string): Promise<boolean> => {
    if (await this.getUserByEmail(email)) return true;
    return false;
  };

  public static getUserByEmail = async (
    email: string
  ): Promise<SystemUser | undefined> => {
    const allSystemUsersJson = await GenericMapper.getAll(systemUserPath);
    const allSystemUsers = this.convertJsonToSystemUserAll(allSystemUsersJson);

    return allSystemUsers.find((systemUser) => systemUser.email === email);
  };

  public static insertSystemUser = async (
    email: string,
    type: ESystemUserType
  ): Promise<void> => {
    const randomPassword = Math.random().toString(36).slice(-10);
    const passwordEncrypted = await EncryptionService.encryptPassword(
      randomPassword
    );

    GenericMapper.insert(systemUserPath, {
      email,
      password: passwordEncrypted,
      type,
    });
  };
}
