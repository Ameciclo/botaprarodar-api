import CreateSystemUserRequest from "../dto/requests/SystemUserDtoRequest";
import SystemUserMapper from "../mapper/SystemUserMapper";
import ESystemUserType from "../models/ESystemUserType";
import { SystemUser } from "../models/SystemUser";
import SystemUserService from "./SystemUserService";

jest.mock("../mapper/SystemUserMapper");
const mockedSystemUserMapper = SystemUserMapper as jest.Mocked<
  typeof SystemUserMapper
>;

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

    const expectedErrorMessage = "";

    const actualResponse = await SystemUserService.createUser(
      createUserRequest
    );
    const actualErrormessage = actualResponse.errorMessages.join(", ");

    return expect(actualErrormessage).toBe(expectedErrorMessage);
  });
});
