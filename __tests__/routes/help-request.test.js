import supertest from "supertest";
import app from "../../src/app";
import { helpRequest, createAndAuthorizeUsers } from "../test-cases";

describe("Help Request", () => {
  let request;
  let server;
  let users;
  const helpRequests = [];

  beforeAll(async () => {
    server = app.listen();
    request = supertest.agent(server);

    users = await createAndAuthorizeUsers(request, 3);

    helpRequests.push({
      payload: { ...helpRequest, fromUser: users[0].userId, assignedUser: users[1].userId }
    });
    helpRequests.push({
      payload: { ...helpRequest, fromUser: users[1].userId, assignedUser: users[0].userId }
    });
  });

  describe("if the user is not logged in", () => {
    const invalidHelpRequestId = null;

    it("Should not register a help request.", async () => {
      const res = await request.post(`/help-request`).send(helpRequest);
      expect(res.status).toBe(401);
    });

    it("Should not retrieve a help request.", async () => {
      const res = await request.get(`/help-request/${invalidHelpRequestId}`);
      expect(res.status).toBe(401);
    });

    it("Should not update a help request.", async () => {
      const res = await request.put(`/help-request/${invalidHelpRequestId}`);
      expect(res.status).toBe(401);
    });

    it("Should not search for someone in need.", async () => {
      const res = await request.post(`/help-request/search/inneed`);
      expect(res.status).toBe(401);
    });

    it("Should not search for a helper.", async () => {
      const res = await request.post(`/help-request/${invalidHelpRequestId}/search/helper`);
      expect(res.status).toBe(401);
    });

    it("Should not assign a help request.", async () => {
      const res = await request.post(`/help-request/${invalidHelpRequestId}/assign`);
      expect(res.status).toBe(401);
    });

    it("Should not accept a help request.", async () => {
      const res = await request.post(`/help-request/${invalidHelpRequestId}/accept`);
      expect(res.status).toBe(401);
    });

    it("Should not finalize a help request changing the status to done.", async () => {
      const res = await request.post(`/help-request/${invalidHelpRequestId}/done`);
      expect(res.status).toBe(401);
    });

    it("Should not delete a help request.", async () => {
      const res = await request.delete(`/help-request/${invalidHelpRequestId}`);
      expect(res.status).toBe(401);
    });
  });

  describe("if the user is logged in and data is wrong", () => {
    const emptyHelpRequestId = "";
    const invalidHelpRequestId = null;

    beforeAll(async () => {
      let res;

      request.set({ 'X-Auth-Token': users[0].token });
      res = await request.post(`/help-request`).send(helpRequests[0].payload);
      helpRequests[0].id = res.body.id;

      request.set({ 'X-Auth-Token': users[1].token });
      res = await request.post(`/help-request`).send(helpRequests[1].payload);
      helpRequests[1].id = res.body.id;
    });

    beforeEach(async () => {
      request.set({ 'X-Auth-Token': users[0].token });
    });

    it("Should not register a help request.", async () => {
      const resInvalidBody = await request.post(`/help-request`).send(helpRequest);
      expect(resInvalidBody.status).toBe(400);

      const invalidHelpRequest = {
        ...helpRequests[0].payload,
        fromUser: users[1].userId,
      };
      const resDifferentUserId = await request.post(`/help-request`).send(invalidHelpRequest);
      expect(resDifferentUserId.status).toBe(401);
    });

    it("Should not retrieve a help request.", async () => {
      const resEmptyHelpRequestId = await request.get(`/help-request/${emptyHelpRequestId}`);
      expect(resEmptyHelpRequestId.status).toBe(404);

      const resInvalidHelpRequestId = await request.get(`/help-request/${invalidHelpRequestId}`);
      expect(resInvalidHelpRequestId.status).toBe(404);
    });

    it("Should not update a help request.", async () => {
      const resEmptyHelpRequestId = await request.put(`/help-request/${emptyHelpRequestId}`);
      expect(resEmptyHelpRequestId.status).toBe(404);

      const resInvalidHelpRequestId = await request.put(`/help-request/${invalidHelpRequestId}`).send(helpRequests[0].payload);
      expect(resInvalidHelpRequestId.status).toBe(404);

      const resEmptyBody = await request.put(`/help-request/${helpRequests[0].id}`).send({});
      expect(resEmptyBody.status).toBe(400);

      const resInvalidBody = await request.put(`/help-request/${helpRequests[1].id}`).send(helpRequests[0].payload);
      expect(resInvalidBody.status).toBe(401);
    });

    it("Should not search for someone in need.", async () => {
      const resInvalidBody = await request.post(`/help-request/search/inneed`).send({});
      expect(resInvalidBody.status).toBe(400);
    });

    it("Should not search for a helper.", async () => {
      const resInvalidHelpRequestId = await request.post(`/help-request/${emptyHelpRequestId}/search/helper`);
      expect(resInvalidHelpRequestId.status).toBe(404);

      const resDifferentHelpRequestId = await request.post(`/help-request/${invalidHelpRequestId}/search/helper`);
      expect(resDifferentHelpRequestId.status).toBe(404);
    });

    it("Should not assign a help request.", async () => {
      const resEmptyHelpRequestId = await request.post(`/help-request/${emptyHelpRequestId}/assign`);
      expect(resEmptyHelpRequestId.status).toBe(404);

      const resInvalidBody = await request.post(`/help-request/${helpRequests[0].id}/assign`).send({});
      expect(resInvalidBody.status).toBe(400);

      const resDifferentHelpRequestId = await request.post(`/help-request/${helpRequests[0].id}/assign`).send({ userId: users[1].userId });
      expect(resDifferentHelpRequestId.status).toBe(401);

      const resInvalidHelpRequestId = await request.post(`/help-request/${invalidHelpRequestId}/assign`).send({ userId: users[0].userId });
      expect(resInvalidHelpRequestId.status).toBe(404);
    });

    it("Should not accept a help request.", async () => {
      const resEmptyHelpRequestId = await request.post(`/help-request/${emptyHelpRequestId}/accept`);
      expect(resEmptyHelpRequestId.status).toBe(404);

      const resInvalidHelpRequestId = await request.post(`/help-request/${invalidHelpRequestId}/accept`);
      expect(resInvalidHelpRequestId.status).toBe(404);
    });

    it("Should not finalize a help request changing the status to done.", async () => {
      const resEmptyHelpRequestId = await request.post(`/help-request/${emptyHelpRequestId}/done`);
      expect(resEmptyHelpRequestId.status).toBe(404);

      const resInvalidHelpRequestId = await request.post(`/help-request/${invalidHelpRequestId}/done`);
      expect(resInvalidHelpRequestId.status).toBe(404);
    });

    it("Should not delete a help request.", async () => {
      const resEmptyHelpRequestId = await request.delete(`/help-request/${emptyHelpRequestId}`);
      expect(resEmptyHelpRequestId.status).toBe(404);

      const resInvalidHelpRequestId = await request.delete(`/help-request/${invalidHelpRequestId}`);
      expect(resInvalidHelpRequestId.status).toBe(404);

      const resDifferentHelpRequestId = await request.delete(`/help-request/${helpRequests[1].id}`);
      expect(resDifferentHelpRequestId.status).toBe(401);
    });
  });

  describe("if the user is logged in and data is right", () => {
    beforeAll(async () => {
      request.set({ 'X-Auth-Token': users[0].token });
    });

    it("Should register a help request.", async () => {
      const res = await request.post(`/help-request`).send(helpRequests[0].payload);
      expect(res.status).toBe(201);
    });

    it("Should retrieve a help request.", async () => {
      const res = await request.get(`/help-request/${helpRequests[0].id}`);
      expect(res.status).toBe(200);
    });

    it("Should update a help request.", async () => {
      const res = await request.put(`/help-request/${helpRequests[0].id}`).send(helpRequests[0].payload);
      expect(res.status).toBe(200);
    });

    it("Should search for someone in need.", async () => {
      const {
        locationLatitude: latitude,
        locationLongitude: longitude
      } = helpRequest;
      const res = await request.post(`/help-request/search/inneed`).send({ latitude, longitude });
      expect(res.status).toBe(200);
    });

    it("Should search for a helper.", async () => {
      const res = await request.post(`/help-request/${helpRequests[0].id}/search/helper`);
      expect(res.status).toBe(200);
    });

    it("Should assign a help request.", async () => {
      const payload = { userId: users[0].userId };
      const res = await request.post(`/help-request/${helpRequests[0].id}/assign`).send(payload);
      expect(res.status).toBe(200);
    });

    it("Should accept a help request.", async () => {
      const res = await request.post(`/help-request/${helpRequests[0].id}/accept`).send({});
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(1);
    });

    it("Should finalize a help request changing the status to done.", async () => {
      const res = await request.post(`/help-request/${helpRequests[0].id}/done`).send({});
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(2);
    });

    it("Should delete a help request.", async () => {
      const res = await request.delete(`/help-request/${helpRequests[0].id}`);
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
