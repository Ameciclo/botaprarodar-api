import bcrypt from "bcrypt";

export default class EncryptionService {
  public static encryptPassword = async (password: string): Promise<string> => {
    const encryptedPassword = await bcrypt.hash(password, 10);
    return encryptedPassword;
  };

  public static comparePassword = (
    plainText: string,
    encrypted: string
  ): Promise<boolean> => bcrypt.compare(plainText, encrypted);
}
