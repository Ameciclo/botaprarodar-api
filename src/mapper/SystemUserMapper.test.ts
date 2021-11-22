import ESystemUserType from "../models/ESystemUserType";
import { SystemUser } from "../models/SystemUser";
import GenericMapper from "./GenericMapper";
import AllUsersMock from "./mocks/AllUsersMock";
import FailedUserMocks from "./mocks/FailedUserMocks";
import SystemUserMapper from "./SystemUserMapper";

jest.mock("../mapper/GenericMapper");
const mockedGenericMapper = GenericMapper as jest.Mocked<typeof GenericMapper>;

describe("SystemUserMapper", () => {
  it("Should return user by email", async () => {
    mockedGenericMapper.getAll.mockResolvedValueOnce(AllUsersMock);
    const user = await SystemUserMapper.getUserByEmail("Fulano@gmail.com");
    const expectedUser: SystemUser = {
      id: "-MotXGM4L2q2KsAo_iVp",
      email: "Fulano@gmail.com",
      password: "senha123",
      type: ESystemUserType.manager,
    };
    expect(user).toStrictEqual(expectedUser);
  });

  it("Should return that user exists", async () => {
    mockedGenericMapper.getAll.mockResolvedValueOnce(AllUsersMock);
    const userExists = await SystemUserMapper.userExistsByEmail(
      "Fulano@gmail.com"
    );

    expect(userExists).toBe(true);
  });

  it("Should return that user does not exist", async () => {
    mockedGenericMapper.getAll.mockResolvedValueOnce(AllUsersMock);
    const userExists = await SystemUserMapper.userExistsByEmail(
      "Teste123@gmail.com"
    );

    expect(userExists).toBe(false);
  });
  it("Should call function to insert user", async () => {
    SystemUserMapper.insertSystemUser(
      "Fulano@gmail.com",
      "senha123",
      ESystemUserType.manager
    );
    expect(GenericMapper.insert).toHaveBeenCalledWith("SystemUser", {
      email: "Fulano@gmail.com",
      password: "senha123",
      type: ESystemUserType.manager,
    });
  });

  it("Should fail to return users because it doesn't have email field", () => {
    mockedGenericMapper.getAll.mockResolvedValue(
      FailedUserMocks.userWithoutEmail
    );

    expect(SystemUserMapper.getUserByEmail("Fulano@gmail.com")).rejects.toMatch(
      "SystemUser deve conter o campo email."
    );
  });

  it("Should fail to return users because it doesn't have password field", () => {
    mockedGenericMapper.getAll.mockResolvedValue(
      FailedUserMocks.userWithoutPassword
    );

    expect(SystemUserMapper.getUserByEmail("Fulano@gmail.com")).rejects.toMatch(
      "SystemUser deve conter o campo senha."
    );
  });

  it("Should fail to return users because it doesn't have type field", () => {
    mockedGenericMapper.getAll.mockResolvedValue(
      FailedUserMocks.userWithoutType
    );

    expect(SystemUserMapper.getUserByEmail("Fulano@gmail.com")).rejects.toMatch(
      "SystemUser deve conter o campo tipo."
    );
  });
});
