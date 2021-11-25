import supertest from "supertest";
import { app, server } from "../index";
import ServiceResponse from "../models/ServiceResponse";
import SystemUserService from "../services/SystemUserService";
import AuthenticationService from "../services/AuthenticationService";

const request = supertest(app);

jest.mock("../services/SystemUserService");
const mockedSystemUserService = SystemUserService as jest.Mocked<
  typeof SystemUserService
>;

jest.mock("../services/AuthenticationService");
const mockedAuthenticationService = AuthenticationService as jest.Mocked<
  typeof AuthenticationService
>;
describe("SystemUserController", () => {
  beforeEach(() => {
    mockedAuthenticationService.verifyJWT.mockImplementation((req, res, next) =>
      next()
    );
  });

  it("Should create user sucessfully", async () => {
    const mockedServiceResponse = new ServiceResponse();
    mockedSystemUserService.createUser.mockResolvedValue(mockedServiceResponse);

    const requestBody = {
      emailNewUser: "novoUsuario@gmail.com",
      passwordNewUser: "senha123",
      typeNewUser: "manager",
      emailCurrentUser: "usuarioAdmin@gmail.com",
    };
    const response = await request.post("/SystemUser").send(requestBody);

    expect(response.status).toBe(200);
  });

  it("Should return 400 when request body is empty", async () => {
    const requestBody = {};
    const response = await request.post("/SystemUser").send(requestBody);

    expect(response.status).toBe(400);
  });

  it("Should return 400 when request body is wrong", async () => {
    const requestBody = {
      emailUser: "novoUsuario@gmail.com",
      passwordNewUser: "senha123",
      typeNewUser: "manager",
      emailCurrentUser: "usuarioAdmin@gmail.com",
    };
    const response = await request.post("/SystemUser").send(requestBody);

    expect(response.status).toBe(400);
  });

  it("Should return 400 when user already exists", async () => {
    const mockedServiceResponse = new ServiceResponse();
    mockedServiceResponse.errorMessages.push("Usuario ja existe");
    mockedSystemUserService.createUser.mockResolvedValue(mockedServiceResponse);

    const requestBody = {
      emailNewUser: "novoUsuario@gmail.com",
      passwordNewUser: "senha123",
      typeNewUser: "manager",
      emailCurrentUser: "usuarioAdmin@gmail.com",
    };
    const response = await request.post("/SystemUser").send(requestBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe("Usuario ja existe");
  });

  it("Should update user password sucessfully", async () => {
    const requestBody = {
      email: "novoUsuario@gmail.com",
      password: "senha123",
    };

    const mockedServiceResponse = new ServiceResponse();
    mockedSystemUserService.updatePassword.mockResolvedValue(
      mockedServiceResponse
    );

    const response = await request
      .put("/SystemUser/password")
      .send(requestBody);

    expect(response.status).toBe(200);
  });

  it("Should return 400 when update password body is wrong", async () => {
    const requestBody = {
      email: "novoUsuario@gmail.com",
      type: "senha123",
    };

    const response = await request
      .put("/SystemUser/password")
      .send(requestBody);

    expect(response.status).toBe(400);
  });

  afterAll(() => {
    server.removeAllListeners();
    server.close();
  });
});
