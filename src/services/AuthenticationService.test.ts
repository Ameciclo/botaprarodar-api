import jwt from "jsonwebtoken";
import SystemUserMapper from "../mapper/SystemUserMapper";
import ESystemUserType from "../models/ESystemUserType";
import ServiceResponse from "../models/ServiceResponse";
import { SystemUser } from "../models/SystemUser";
import AuthenticationService from "./AuthenticationService";
import EncryptionService from "./EncryptionService";

jest.mock("jsonwebtoken");
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

jest.mock("../mapper/SystemUserMapper");
const mockedSystemUserMapper = SystemUserMapper as jest.Mocked<
  typeof SystemUserMapper
>;
describe("AuthenticationService", () => {
  it("Should sign in sucessfully and return token", async () => {
    const loginRequest = {
      email: "user@gmail.com",
      password: "senha123",
    };

    const user: SystemUser = {
      id: "abcd123",
      email: "user@gmail.com",
      password: await EncryptionService.encryptPassword("senha123"),
      type: ESystemUserType.manager,
    };

    mockedSystemUserMapper.getUserByEmail.mockResolvedValue(user);

    mockedJwt.sign.mockImplementation(() => "token123");

    const expectedResponse = new ServiceResponse<string>();
    expectedResponse.returnValue = "token123";

    const actualResponse = await AuthenticationService.signIn(
      loginRequest.email,
      loginRequest.password
    );

    expect(actualResponse.returnValue).toBe(expectedResponse.returnValue);
    expect(actualResponse.success()).toBe(expectedResponse.success());
  });

  it("Should fail sign in and return error message when user does not exist", async () => {
    const loginRequest = {
      email: "user@gmail.com",
      password: "senha123",
    };

    mockedSystemUserMapper.getUserByEmail.mockResolvedValue(undefined);

    const expectedResponse = new ServiceResponse<string>();
    expectedResponse.errorMessages.push("Usuario nao existe.");

    const actualResponse = await AuthenticationService.signIn(
      loginRequest.email,
      loginRequest.password
    );

    expect(actualResponse.errorMessages).toStrictEqual(
      expectedResponse.errorMessages
    );
    expect(actualResponse.success()).toBe(expectedResponse.success());
  });

  it("Should fail at sign in and return error message when login invalid", async () => {
    const loginRequest = {
      email: "user@gmail.com",
      password: "senha123",
    };

    const user: SystemUser = {
      id: "abcd123",
      email: "user@gmail.com",
      password: await EncryptionService.encryptPassword("senha456"),
      type: ESystemUserType.manager,
    };

    mockedSystemUserMapper.getUserByEmail.mockResolvedValue(user);

    const expectedResponse = new ServiceResponse<string>();
    expectedResponse.errorMessages.push("Login inválido!");

    const actualResponse = await AuthenticationService.signIn(
      loginRequest.email,
      loginRequest.password
    );

    expect(actualResponse.errorMessages).toStrictEqual(
      expectedResponse.errorMessages
    );
    expect(actualResponse.success()).toBe(expectedResponse.success());
  });
});
