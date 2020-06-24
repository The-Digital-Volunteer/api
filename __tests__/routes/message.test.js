import supertest from "supertest";
import app from "../../src/app";
import { message, createAndAuthorizeUsers } from "../test-cases";

describe("Message", () => {
  let request;
  let server;
  let users;

  beforeAll(async () => {
    server = app.listen();
    request = supertest.agent(server);

    users = await createAndAuthorizeUsers(request, 2);
  });

  describe("if the user is not logged in", () => {
    const invalidMessageId = null;
    const invalidUserId = null;

    it("Should not register a message.", async () => {
      const res = await request.post(`/message`).send(message);
      expect(res.status).toBe(401);
    });

    it("Should not retrieve a message.", async () => {
      const res = await request.get(`/message/${invalidMessageId}`);
      expect(res.status).toBe(401);
    });

    it("Should not retrieve user sent messages.", async () => {
      const res = await request.get(`/user/${invalidUserId}/messages/sent`);
      expect(res.status).toBe(401);
    });

    it("Should not retrieve user received messages.", async () => {
      const res = await request.get(`/user/${invalidUserId}/messages/received`);
      expect(res.status).toBe(401);
    });

    it("Should not delete a message.", async () => {
      const res = await request.delete(`/message/${invalidMessageId}`);
      expect(res.status).toBe(401);
    });
  });

  describe("if the user is logged in and data is wrong", () => {
    beforeAll(async () => {
      request.set({ 'X-Auth-Token': users[0].token });
    });
    const invalidMessageId = "";
    const invalidUserId = "";

    it("Should not register a message.", async () => {
      const res = await request.post(`/message`).send(message);
      expect(res.status).toBe(400);

      const newMessage = {
        fromUser: users[1].userId,
        toUser: users[1].userId,
        helpRequest: 2,
        title: "title",
        content: "content",
      };
      const resDifferentUserId = await request.post(`/message`).send(newMessage);
      expect(resDifferentUserId.status).toBe(401);
    });

    it("Should not retrieve a message.", async () => {
      const res = await request.get(`/message/${invalidMessageId}`);
      expect(res.status).toBe(404);
    });

    it("Should not retrieve user sent messages.", async () => {
      const res = await request.get(`/user/${invalidUserId}/messages/sent`);
      expect(res.status).toBe(404);
    });

    it("Should not retrieve user received messages.", async () => {
      const res = await request.get(`/user/${invalidUserId}/messages/received`);
      expect(res.status).toBe(404);
    });

    it("Should not delete a message.", async () => {
      const res = await request.delete(`/message/${invalidMessageId}`);
      expect(res.status).toBe(404);
    });
  });

  describe("if the user is logged in and data is right", () => {
    let messageId;

    beforeAll(async () => {
      request.set({ 'X-Auth-Token': users[0].token });
    });

    it("Should register a message.", async () => {
      const newMessage = {
        fromUser: users[0].userId,
        toUser: users[1].userId,
        helpRequest: 2,
        title: "title",
        content: "content",
      };
      const res = await request.post(`/message`).send(newMessage);
      messageId = res.body.id;
      expect(res.status).toBe(201);
    });

    it("Should retrieve a message.", async () => {
      request.set({ 'X-Auth-Token': users[1].token });
      const res = await request.get(`/message/${messageId}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(messageId);
    });

    it("Should retrieve user sent messages.", async () => {
      request.set({ 'X-Auth-Token': users[0].token });
      const res = await request.get(`/user/${users[0].userId}/messages/sent`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("Should retrieve user received messages.", async () => {
      request.set({ 'X-Auth-Token': users[1].token });
      const res = await request.get(`/user/${users[1].userId}/messages/received`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("Should delete a message.", async () => {
      request.set({ 'X-Auth-Token': users[0].token });
      const res = await request.delete(`/message/${messageId}`);
      expect(res.status).toBe(200);
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
