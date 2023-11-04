"use strict";

const request = require("supertest");

const app = require("../app");
const User = require("../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  uToken
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);




/******* GET /users/:id *********************/

describe("GET /users/:id", function () {
  test("works user auth", async function () {
    const resp = await request(app)
      .get(`/users/${testUserIds[0]}`)
      .set("authorization", `Bearer ${uToken}`);
    expect(resp.body).toEqual({
      user: {
        id: "1",
        email: "expense1@tracker.com",
        firstName: "User1First",
        lastName: "User1Last",
        oauthId: null,
        oauthPicture: null,
        isOauth: false,
        categories:
          [
            {
              id: "1",
              name: "Salary",
              type: "Income",
              userId: "1",
            },
            {
              id: "2",
              name: "Rent",
              type: "Expense",
              userId: "1",
            },
            {
              id: "3",
              name: "Groceries",
              type: "Expense",
              userId: "1",
            },
          ],
      },
    });
  });



  test("unauth for other users", async function () {
    const resp = await request(app)
      .get(`/users/${testUserIds[0]}`)
      .set("authorization", `Bearer ${uToken + "jhh"}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .get(`/users/${testUserIds[0]}`)
    expect(resp.statusCode).toEqual(401);
  });


});

/************************************** PATCH /users/:username */

describe("PATCH /users/:id", () => {
  test("works for user", async function () {
    const resp = await request(app)
      .patch(`/users/${testUserIds[0]}`)
      .send({
        firstName: "New",
      })
      .set("authorization", `Bearer ${uToken}`);
    expect(resp.body).toEqual({
      user: {
        id: "1",
        email: "expense1@tracker.com",
        firstName: "New",
        lastName: "User1Last",
        oauthId: null,
        oauthPicture: null,
        isOauth: false
      },
    });
  });


  test("unauth if not same user", async function () {
    const resp = await request(app)
      .patch(`/users/${testUserIds[0]}`)
      .send({
        firstName: "New",
      })
      .set("authorization", `Bearer ${uToken + "dfge"}`);
    expect(resp.statusCode).toEqual(401);
  });



  test("bad request if invalid data", async function () {
    const resp = await request(app)
      .patch(`/users/${testUserIds[0]}`)
      .send({
        firstName: 42,
      })
      .set("authorization", `Bearer ${uToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("works: can set new password", async function () {
    const resp = await request(app)
      .patch(`/users/${testUserIds[0]}`)
      .send({
        password: "new-password",
      })
      .set("authorization", `Bearer ${uToken}`);
    expect(resp.body).toEqual({
      user: {
        id: "1",
        email: "expense1@tracker.com",
        firstName: "User1First",
        lastName: "User1Last",
        oauthId: null,
        oauthPicture: null,
        isOauth: false
      },
    });
    const isSuccessful = await User.authenticate("expense1@tracker.com", "new-password");
    expect(isSuccessful).toBeTruthy();
  });

});

/************* DELETE /users/:username **************/

describe("DELETE /users/:id", function () {

  test("works for same user", async function () {
    const resp = await request(app)
      .delete(`/users/${testUserIds[0]}`)
      .set("authorization", `Bearer ${uToken}`);
    expect(resp.body).toEqual({ deleted: "1" });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
      .delete(`/users/${testUserIds[0]}`)
      .set("authorization", `Bearer ${uToken + "zds"}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .delete(`/users/${testUserIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });


});


