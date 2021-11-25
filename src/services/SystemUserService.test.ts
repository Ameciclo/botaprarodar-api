import CreateSystemUserRequest from "../dto/requests/SystemUserDtoRequest";
import SystemUserMapper from "../mapper/SystemUserMapper";
import ESystemUserType from "../models/ESystemUserType";
import { SystemUser } from "../models/SystemUser";
import SystemUserService from "./SystemUserService";
import EmailService from "./EmailService";

jest.mock("../mapper/SystemUserMapper");
const mockedSystemUserMapper = SystemUserMapper as jest.Mocked<
  typeof SystemUserMapper
>;

jest.mock("./EmailService");
const mockedEmailService = EmailService as jest.Mocked<typeof EmailService>;
describe("SystemUserService", () => {
  it("Should fail at creating user because user already exists", async () => {
    const createUserRequest: CreateSystemUserRequest = {
      emailNewUser: "manager@gmail.com",
      typeNewUser: ESystemUserType.manager,
      emailCurrentUser: "admin@gmail.com",
    };

    mockedSystemUserMapper.userExistsByEmail.mockResolvedValue(true);

    const expectedErrorMessage = "Usuario ja existe.";

    const actualResponse = await SystemUserService.createUser(
      createUserRequest
    );
    const actualErrormessage = actualResponse.errorMessages.join(", ");

    return expect(actualErrormessage).toBe(expectedErrorMessage);
  });

  it("Should fail at creating user because current user is not admin", async () => {
    const createUserRequest: CreateSystemUserRequest = {
      emailNewUser: "newManager@gmail.com",
      typeNewUser: ESystemUserType.manager,
      emailCurrentUser: "manager@gmail.com",
    };

    const systemUserManager: SystemUser = {
      id: "abcd123",
      email: "manager@gmail.com",
      password: "senha123",
      type: ESystemUserType.manager,
    };
    mockedSystemUserMapper.getUserByEmail.mockResolvedValue(systemUserManager);
    mockedSystemUserMapper.userExistsByEmail.mockResolvedValue(false);

    const expectedErrorMessage = "Usuario atual nao e administrador.";

    const actualResponse = await SystemUserService.createUser(
      createUserRequest
    );
    const actualErrormessage = actualResponse.errorMessages.join(", ");

    return expect(actualErrormessage).toBe(expectedErrorMessage);
  });

  it("Should fail at creating user because user was not created for some unexpected failure", async () => {
    const createUserRequest: CreateSystemUserRequest = {
      emailNewUser: "newManager@gmail.com",
      typeNewUser: ESystemUserType.manager,
      emailCurrentUser: "admin@gmail.com",
    };

    const systemUserAdmin: SystemUser = {
      id: "abcd123",
      email: "admin@gmail.com",
      password: "senha123",
      type: ESystemUserType.admin,
    };
    mockedSystemUserMapper.getUserByEmail.mockResolvedValue(systemUserAdmin);
    mockedSystemUserMapper.userExistsByEmail.mockResolvedValue(false);

    const expectedErrorMessage = "Nao foi possivel criar o usuario.";

    const actualResponse = await SystemUserService.createUser(
      createUserRequest
    );
    const actualErrormessage = actualResponse.errorMessages.join(", ");

    return expect(actualErrormessage).toBe(expectedErrorMessage);
  });

  it("Should create user sucessfully", async () => {
    const createUserRequest: CreateSystemUserRequest = {
      emailNewUser: "newManager@gmail.com",
      typeNewUser: ESystemUserType.manager,
      emailCurrentUser: "admin@gmail.com",
    };

    const systemUserAdmin: SystemUser = {
      id: "abcd123",
      email: "admin@gmail.com",
      password: "senha123",
      type: ESystemUserType.admin,
    };
    mockedSystemUserMapper.getUserByEmail.mockResolvedValue(systemUserAdmin);
    mockedSystemUserMapper.userExistsByEmail.mockResolvedValueOnce(false);
    mockedSystemUserMapper.userExistsByEmail.mockResolvedValue(true);
    mockedEmailService.sendEmail.mockImplementation(jest.fn());

    const expectedErrorMessage = "";

    const actualResponse = await SystemUserService.createUser(
      createUserRequest
    );
    const actualErrormessage = actualResponse.errorMessages.join(", ");

    return expect(actualErrormessage).toBe(expectedErrorMessage);
  });

  it("Should update password sucessfully", async () => {
    const systemUser: SystemUser = {
      id: "abcd123",
      email: "admin@gmail.com",
      password: "oldPassword123",
      type: ESystemUserType.admin,
    };
    mockedSystemUserMapper.getUserByEmail.mockResolvedValue(systemUser);
    mockedSystemUserMapper.updateSystemUserPassword.mockResolvedValue();

    const actualResponse = await SystemUserService.updatePassword(
      systemUser.email,
      "newPassword123"
    );

    expect(actualResponse.success()).toBe(true);
  });

  it("Should fail at update password", async () => {
    mockedSystemUserMapper.updateSystemUserPassword.mockRejectedValue(
      new Error("Ususario nao existe.")
    );

    const actualResponse = await SystemUserService.updatePassword(
      "systemUseremail@gmail.com",
      "newPassword123"
    );

    expect(actualResponse.errorMessages).toStrictEqual([
      "Ususario nao existe.",
    ]);
  });
});
