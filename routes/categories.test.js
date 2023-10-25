"use strict";

const request = require("supertest");

const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testUserIds,
    testCategoriesIds,
    uToken
  } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /categories */

describe("POST /categories", function () {
  const newCategory = {
    userId:"1",
    name:"Netflix",
    type:"Expense"
  };

  test("ok for user", async function () {
    const resp = await request(app)
        .post("/categories")
        .send(newCategory)
        .set("authorization", `Bearer ${uToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
        category: {
            ...newCategory,
            id: expect.any(String)
        },
    });
  });



  test("bad request with missing data", async function () {
    delete newCategory.name;
    const resp = await request(app)
        .post("/categories")
        .send(newCategory)
        .set("authorization", `Bearer ${uToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/categories")
        .send({
          ...newCategory,
          name: 15,
        })
        .set("authorization", `Bearer ${uToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});


/************************************** GET /categories/users/:id */

describe("GET /categories/users/:id", function () {
  
    test("works for a user", async function () {
    const resp = await request(app)
    .get(`/categories/users/${testUserIds[0]}`)
    .set("authorization", `Bearer ${uToken}`);
    console.log(resp.body);
    expect(resp.body).toEqual({

        categories: [
            { id: '1', userId: "1", name: 'Salary', type: 'Income' },
            { id: '2', userId: "1", name: 'Rent', type: 'Expense' },
            { id: '3', userId: "1", name: 'Groceries', type: 'Expense' }
          ]
      
    });
  });



  test("not found for no such category", async function () {
    const resp = await request(app) .get(`/categories/users/30`)
    .set("authorization", `Bearer ${uToken}`);
    expect(resp.statusCode).toEqual(404);
  });

});

/************************************** PATCH /categories/:id */

describe("PATCH /categories/:id", function () {
  test("works for user", async function () {
    const resp = await request(app)
        .patch(`/categories/1`)
        .send({
          name: "Amazon",
          type: "Expense",
        })
        .set("authorization", `Bearer ${uToken}`);
        expect(resp.body).toEqual({category: { id: '1', userId: "1", name: 'Amazon', type: 'Expense' },
    });
  });


  test("unauth for user", async function () {
    const resp = await request(app)
        .patch(`/categories/1`)
        .send({
            name: "Amazon",
            type: "Expense",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such category", async function () {
    const resp = await request(app)
        .patch(`/categories/90`)
        .send({
            name: "Amazon",
            type: "Expense",
        })
        .set("authorization", `Bearer ${uToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on name change attempt", async function () {
    const resp = await request(app)
        .patch(`/categories/1`)
        .send({
            name: 11,
        })
        .set("authorization", `Bearer ${uToken}`);
    expect(resp.statusCode).toEqual(400);
  });


});

/************************************** DELETE /categories/:id */

describe("DELETE /categories/:id", function () {
  test("works for user", async function () {
    const resp = await request(app)
        .delete(`/categories/1`)
        .set("authorization", `Bearer ${uToken}`);
    expect(resp.body).toEqual({ deleted: 1 });
  });

 

  test("unauth for user", async function () {
    const resp = await request(app)
        .delete(`/categories/1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such company", async function () {
    const resp = await request(app)
        .delete(`/categories/20`)
        .set("authorization", `Bearer ${uToken}`);
    expect(resp.statusCode).toEqual(404);
  });


});
