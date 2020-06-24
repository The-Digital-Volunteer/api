import supertest from "supertest";
import app from "../src/app";
import { createAndAuthorizeUsers } from "./test-cases";

describe("Auth Policy", () => {
  let request;
  let server;
  let users;

  beforeAll(async () => {
    server = app.listen();
    request = supertest.agent(server);

    users = await createAndAuthorizeUsers(request, 1);
  });

  it("Should not register a user rating.", async () => {
    const res = await request.get(`/`);
    expect(res.status).toBe(401);
  });

  it("Should not register a user rating.", async () => {
    const res = await request.post(`/`).send({ token: "token" });
    expect(res.status).toBe(401);
  });

  it("Should not register a user rating.", async () => {
    request.set({ 'X-Auth-Token': "token" });
    const res = await request.get(`/`);
    expect(res.status).toBe(401);
  });

  it("Should not register a user rating.", async () => {
    request.set({ 'X-Auth-Token': users[0].token });
    const res = await request.get(`/`);
    expect(res.status).toBe(404);
  });

  afterAll(async (done) => {
    users.map(async ({ token, userId }) => {
      await request.set({ 'X-Auth-Token': token });
      await request.delete(`/users/${userId}`);
    });

    server.close(done);
  });
});
