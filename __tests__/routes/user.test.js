import supertest from "supertest";
import app from "../../src/app";
import { user } from "../test-cases";

describe("User", () => {
  let request;
  let server;
  let userId;
  let email;
  let bankId;
  let password;

  beforeAll(async () => {
    server = app.listen();
    request = supertest.agent(server);
    const timestamp = new Date().getTime();
    email = `${timestamp}@mail.com`;
    bankId = `bank_${timestamp}`;
    password = `${timestamp}`;
  });

  describe("if the user is not logged in", () => {
    it("Should register a user.", async () => {
      const newUser = { ...user, email, bankId, password };

      const res = await request.post(`/users`).send(newUser);
      ({ id: userId } = res.body);
      expect(res.status).toBe(201);
      expect(res.body.firstName).toBe(newUser.firstName);
    });

    it("Should authorize a user.", async () => {
      const payload = { email, bankId, password };
      const res = await request.post(`/users/auth`).send(payload);
      expect(res.status).toBe(200);
      expect(res.body.token).toBeTruthy();
    });

    it("Should not retrieve a user.", async () => {
      const res = await request.get(`/users/${userId}`);
      expect(res.status).toBe(401);
    });

    it("Should not update a user.", async () => {
      const res = await request.put(`/users/${userId}`).send({});
      expect(res.status).toBe(401);
    });

    it("Should not delete a user.", async () => {
      const res = await request.delete(`/users/${userId}`);
      expect(res.status).toBe(401);
    });

    it("Should not log out a user.", async () => {
      const res = await request.get(`/users/${userId}/logout`);
      expect(res.status).toBe(401);
    });
  });

  describe("if the user is not logged in and data is wrong", () => {
    it("Should not register a user.", async () => {
      const invalidUser = { ...user };
      delete invalidUser.email;
      delete invalidUser.bankId;
      delete invalidUser.password;

      const res = await request.post(`/users`).send(invalidUser);
      expect(res.status).toBe(400);
    });

    it("Should not authorize a user.", async () => {
      const resBadRequest = await request.post(`/users/auth`).send({});
      expect(resBadRequest.status).toBe(400);

      const payload = { email, bankId, password: "invalidPassword" };
      const res = await request.post(`/users/auth`).send(payload);
      expect(res.status).toBe(401);
    });
  });

  describe("if the user is logged in and data is wrong", () => {
    beforeAll(async () => {
      const payload = { email, bankId, password };
      const res = await request.post(`/users/auth`).send(payload);
      request.set({ 'X-Auth-Token': res.body.token });
    });
    const invalidUserId = null;
    const emptyUserId = "";

    it("Should not retrieve a user.", async () => {
      const resInvalidUserId = await request.get(`/users/${invalidUserId}`);
      expect(resInvalidUserId.status).toBe(404);

      const resEmptyUserId = await request.get(`/users/${emptyUserId}`);
      expect(resEmptyUserId.status).toBe(404);
    });

    it("Should not update a user.", async () => {
      const newUser = { ...user, email, bankId };
      const resInvalidUserId = await request.put(`/users/${invalidUserId}`).send(newUser);
      expect(resInvalidUserId.status).toBe(401);

      const resEmptyUserId = await request.put(`/users/${emptyUserId}`).send({});
      expect(resEmptyUserId.status).toBe(404);

      const resEmptyBody = await request.put(`/users/${userId}`).send({});
      expect(resEmptyBody.status).toBe(400);
    });

    it("Should not delete a user.", async () => {
      const resInvalidUserId = await request.delete(`/users/${invalidUserId}`);
      expect(resInvalidUserId.status).toBe(401);

      const resEmptyUserId = await request.delete(`/users/${emptyUserId}`);
      expect(resEmptyUserId.status).toBe(404);
    });

    it("Should not log out a user.", async () => {
      const resInvalidUserId = await request.get(`/users/${invalidUserId}/logout`);
      expect(resInvalidUserId.status).toBe(401);

      const resEmptyUserId = await request.get(`/users/${emptyUserId}/logout`);
      expect(resEmptyUserId.status).toBe(404);
    });
  });

  describe("if the user is logged in and data is right", () => {
    beforeEach(async () => {
      const payload = { email, bankId, password };
      const res = await request.post(`/users/auth`).send(payload);
      request.set({ 'X-Auth-Token': res.body.token });
    });

    it("Should retrieve a user.", async () => {
      const res = await request.get(`/users/${userId}`);
      expect(res.status).toBe(200);
    });

    it("Should update a user.", async () => {
      const newUser = { ...user, email, bankId };
      const res = await request.put(`/users/${userId}`).send(newUser);
      expect(res.status).toBe(200);
    });

    it("Should log out a user.", async () => {
      const res = await request.get(`/users/${userId}/logout`);
      expect(res.status).toBe(200);
    });

    it("Should disable a user.", async () => {
      const res = await request.delete(`/users/${userId}`).send({ onlyDisable: true });
      expect(res.status).toBe(200);
    });

    it("Should delete a user.", async () => {
      const res = await request.delete(`/users/${userId}`);
      expect(res.status).toBe(200);
    });
  });

  afterAll(async (done) => {
    server.close(done);
  });
});
