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

/************************************** POST /transactions */

describe("POST /transactions", function () {
  const newTransaction = {
    userId:"1",
    categoryId:"1",
    amount:"12",
    date:"2023-10-09",
    note:"Youtube"
  };

  test("ok for user", async function () {
    const resp = await request(app)
        .post("/transactions")
        .send(newTransaction)
        .set("authorization", `Bearer ${uToken}`);
    expect(resp.statusCode).toEqual(201);
    console.log(resp.body);
    expect(resp.body).toEqual({
        transaction: {
            id: expect.any(String),
            categoryId: '1',
            userId: '1',
            amount: '12.00',
            date: expect.any(String),
            note: 'Youtube'
          }
    });
  });



  test("bad request with missing data", async function () {
    delete newTransaction.categoryId;
    const resp = await request(app)
        .post("/transactions")
        .send(newTransaction)
        .set("authorization", `Bearer ${uToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/transactions")
        .send({
          ...newTransaction,
          date: 15,
        })
        .set("authorization", `Bearer ${uToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});


/************************************** GET /transactions/users/:id */

describe("GET /transactions/users/:id", function () {
  
    test("works for a user", async function () {
    const resp = await request(app)
    .get(`/transactions/users/${testUserIds[0]}`)
    .set("authorization", `Bearer ${uToken}`);
    console.log(resp.body);
    expect(resp.body).toEqual({

         transactions: [
        {
            id: '1',
            categoryId: '1',
            userId: '1',
            amount: '7500.00',
            date: expect.any(String),
            note: '',
            categoryName: 'Salary',
            categoryType: 'Income'
          },
          {
            id: '2',
            categoryId: '2',
            userId: '1',
            amount: '1200.00',
            date: expect.any(String),
            note: '',
            categoryName: 'Rent',
            categoryType: 'Expense'
          },
          {
            id: '3',
            categoryId: '3',
            userId: '1',
            amount: '180.00',
            date: expect.any(String),
            note: '',
            categoryName: 'Groceries',
            categoryType: 'Expense'
          }
        ]
      
     });
  });



  test("not found for no such transaction", async function () {
    const resp = await request(app) .get(`/transactions/users/30`)
    .set("authorization", `Bearer ${uToken}`);
    expect(resp.statusCode).toEqual(404);
  });

});

/************************************** PATCH /transactions/:id */

describe("PATCH /transactions/:id", function () {
  test("works for user", async function () {
    const resp = await request(app)
        .patch(`/transactions/1`)
        .send({
          amount: "2300",
        })
        .set("authorization", `Bearer ${uToken}`);
        expect(resp.body).toEqual({
            transaction: 
            {
                id: '1',
                categoryId: '1',
                userId: '1',
                amount: '2300.00',
                date: expect.any(String),
                note: ''
              },
    });
  });


  test("unauth for user", async function () {
    const resp = await request(app)
        .patch(`/transactions/1`)
        .send({
            amount: "2300",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such transaction", async function () {
    const resp = await request(app)
        .patch(`/transactions/90`)
        .send({
            amount: "2300",
        })
        .set("authorization", `Bearer ${uToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on amount change attempt", async function () {
    const resp = await request(app)
        .patch(`/transactions/1`)
        .send({
            amount: 1222,
        })
        .set("authorization", `Bearer ${uToken}`);
    expect(resp.statusCode).toEqual(400);
  });


});

/************************************** DELETE /transactions/:id */

describe("DELETE /transactions/:id", function () {
  test("works for user", async function () {
    const resp = await request(app)
        .delete(`/transactions/1`)
        .set("authorization", `Bearer ${uToken}`);
    expect(resp.body).toEqual({ deleted: 1 });
  });

 

  test("unauth for user", async function () {
    const resp = await request(app)
        .delete(`/transactions/1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such transaction", async function () {
    const resp = await request(app)
        .delete(`/transactions/20`)
        .set("authorization", `Bearer ${uToken}`);
    expect(resp.statusCode).toEqual(404);
  });


});
