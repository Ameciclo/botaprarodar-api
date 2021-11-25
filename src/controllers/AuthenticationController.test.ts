import supertest from "supertest";
import { app, server } from "../index";
import ServiceResponse from "../models/ServiceResponse";
import AuthenticationService from "../services/AuthenticationService";

const request = supertest(app);

jest.mock("../services/AuthenticationService");
const mockedAuthenticationService = AuthenticationService as jest.Mocked<
  typeof AuthenticationService
>;

describe("AuthenticationController", () => {
  it("Should authenticate and return token", async () => {
    const mockedServiceResponse = new ServiceResponse<string>();
    mockedServiceResponse.returnValue = "token123";
    mockedAuthenticationService.signIn.mockResolvedValue(mockedServiceResponse);

    const requestBody = {
      email: "user@gmail.com",
      password: "senha123",
    };
    const response = await request.post("/login").send(requestBody);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      auth: true,
      token: "token123",
    });
  });

  it("Should return status 400 when body is empty", async () => {
    const mockedServiceResponse = new ServiceResponse<string>();
    mockedServiceResponse.errorMessages.push("Usuario nao existe.");
    mockedAuthenticationService.signIn.mockResolvedValue(mockedServiceResponse);

    const requestBody = {};
    const response = await request.post("/login").send(requestBody);

    expect(response.status).toBe(400);
  });

  afterAll(() => {
    server.removeAllListeners();
    server.close();
  });
});
