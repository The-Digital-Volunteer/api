import supertest from "supertest";
import app from "../../src/app";
import { rating, createAndAuthorizeUsers } from "../test-cases";

describe("Rating", () => {
  let request;
  let server;
  let users;

  beforeAll(async () => {
    server = app.listen();
    request = supertest.agent(server);

    users = await createAndAuthorizeUsers(request, 2);
  });

  describe("if the user is not logged in", () => {
    const invalidUserId = null;

    it("Should not register a user rating.", async () => {
      const res = await request.post(`/rating`).send(rating);
      expect(res.status).toBe(401);
    });

    it("Should not retrieve a user rating received.", async () => {
      const res = await request.get(`/user/${invalidUserId}/ratings/received`);
      expect(res.status).toBe(401);
    });

    it("Should not retrieve a user rating created.", async () => {
      const res = await request.get(`/user/${invalidUserId}/ratings/created`);
      expect(res.status).toBe(401);
    });
  });

  describe("if the user is logged in and data is wrong", () => {
    beforeAll(async () => {
      request.set({ 'X-Auth-Token': users[0].token });
    });
    const emptyUserId = "";

    it("Should not register a user rating.", async () => {
      let invalidRating;
      let res;

      invalidRating = { ...rating, fromUser: users[0].userId };
      res = await request.post(`/rating`).send(invalidRating);
      expect(res.status).toBe(400);

      invalidRating = { ...rating, fromUser: users[1].userId, toUser: users[0].userId, value: 3, comment: "" };
      res = await request.post(`/rating`).send(invalidRating);
      expect(res.status).toBe(401);
    });

    it("Should not retrieve a user rating received.", async () => {
      const resEmptyUserId = await request.get(`/user/${emptyUserId}/ratings/received`);
      expect(resEmptyUserId.status).toBe(404);

      const resInvalidUserId = await request.get(`/user/${users[1].userId}/ratings/received`);
      expect(resInvalidUserId.status).toBe(401);
    });

    it("Should not retrieve a user rating created.", async () => {
      const resEmptyUserId = await request.get(`/user/${emptyUserId}/ratings/created`);
      expect(resEmptyUserId.status).toBe(404);

      const resInvalidUserId = await request.get(`/user/${users[1].userId}/ratings/created`);
      expect(resInvalidUserId.status).toBe(401);
    });
  });

  describe("if the user is logged in and data is right", () => {
    beforeAll(async () => {
      request.set({ 'X-Auth-Token': users[0].token });
    });

    it("Should register a user rating.", async () => {
      const newRating = {
        fromUser: users[0].userId,
        toUser: users[1].userId,
        value: 7,
        comment: "No comments",
      };
      const res = await request.post(`/rating`).send(newRating);
      expect(res.status).toBe(201);
    });

    it("Should retrieve a user rating received.", async () => {
      request.set({ 'X-Auth-Token': users[1].token });
      const res = await request.get(`/user/${users[1].userId}/ratings/received`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("Should retrieve a user rating created.", async () => {
      request.set({ 'X-Auth-Token': users[0].token });
      const res = await request.get(`/user/${users[0].userId}/ratings/created`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  afterAll(async (done) => {
    users.map(async ({ token, userId }) => {
      await request.set({ 'X-Auth-Token': token });
      await request.delete(`/users/${userId}`);
    });

    server.close(done);
  });
});
