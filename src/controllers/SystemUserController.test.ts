import supertest from "supertest";
import { app, server } from "../index";
import ServiceResponse from "../models/ServiceResponse";
import SystemUserService from "../services/SystemUserService";

const request = supertest(app);

jest.mock("../services/SystemUserService");
const mockedSystemUserService = SystemUserService as jest.Mocked<
  typeof SystemUserService
>;

describe("SystemUserController", () => {
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

  it("Should return 500 when request body is empty", async () => {
    const requestBody = {};
    const response = await request.post("/SystemUser").send(requestBody);

    expect(response.status).toBe(500);
  });

  it("Should return 500 when request body is wrong", async () => {
    const requestBody = {
      emailUser: "novoUsuario@gmail.com",
      passwordNewUser: "senha123",
      typeNewUser: "manager",
      emailCurrentUser: "usuarioAdmin@gmail.com",
    };
    const response = await request.post("/SystemUser").send(requestBody);

    expect(response.status).toBe(500);
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

  afterAll(() => {
    server.close();
  });
});
