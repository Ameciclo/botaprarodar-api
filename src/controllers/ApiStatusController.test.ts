import supertest from "supertest";
import { app, server } from "../index";

const request = supertest(app);

describe("ApiStatusController", () => {
  it("Should return message that server is on", async () => {
    const response = await request.get("/");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("O servidor esta rodando...");
  });

  afterAll(() => {
    server.removeAllListeners();
    server.close();
  });
});
