"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Transaction = require("./transaction.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testUserIds,
    testCategoriesIds
  
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************************************** create */

describe("create", function () {
  test("works", async function () {
    let newTransaction = {
        userId: testUserIds[0],
        categoryId: testCategoriesIds[0].id,
        amount: "2000",
        date: "2023-10-23",
        note:""
      };
    let transaction = await Transaction.create(newTransaction);
    delete transaction.id
    expect(transaction).toEqual({
      ...newTransaction,
      date: expect.any(Date),
      amount: "2000.00",
    });
  });
});

// /************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let transaction = await Transaction.findAll(testUserIds[0]);

    expect(transaction).toEqual([
        {
            id: '1',
            categoryId: testCategoriesIds[0].id,
            userId: testUserIds[0],
            amount: '7500.00',
            date: expect.any(Date),
            note: '',
            categoryName: 'Salary',
            categoryType: 'Income'
          },
          {
            id: '2',
            categoryId: testCategoriesIds[1].id,
            userId: testUserIds[0],
            amount: '1200.00',
            date: expect.any(Date),
            note: '',
            categoryName: 'Rent',
            categoryType: 'Expense'
          },
          {
            id: '3',
            categoryId: testCategoriesIds[2].id,
            userId: testUserIds[0],
            amount: '180.00',
            date: expect.any(Date),
            note: '',
            categoryName: 'Groceries',
            categoryType: 'Expense'
          }
      ]);
  });

});

// /************************************** get */

describe("get", function () {
  test("works", async function () {
    const categoryId = testCategoriesIds[0].id;
    const userId = testUserIds[0];  
    let transaction = await Transaction.get(1,userId);
    console.log(transaction);

    expect(transaction).toEqual(
        {
            id: '1',
            categoryId: categoryId,
            userId: userId,
            amount: '7500.00',
            date: expect.any(Date),
            note: '',
            categoryName: 'Salary',
            categoryType: 'Income'
          }
    );
  });

  test("not found if no such transaction", async function () {
    try {
      await Transaction.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// /************************************** update */

describe("update", function () {
  test("works", async function () {
    let updateData = {
        categoryId: testCategoriesIds[0].id,
        amount: "1000",
        date:"2023-10-23",
        note: ""
      };
    let transaction = await Transaction.update(1, updateData);
    console.log(transaction);
    delete transaction.id;
    expect(transaction).toEqual({
        ...updateData,
        amount: "1000.00",
        date: expect.any(Date),
        userId:testUserIds[0]
    });
  });

  test("not found if no such transaction", async function () {
    try {
      await Transaction.update(0, {
        categoryId: testCategoriesIds[0].id,
        amount: "1000",
        date:"2023-10-23",
        note: ""
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Transaction.update(1, {});
      fail();
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
    }
  });

});

// /************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Transaction.remove(1);
    const res = await db.query(
        "SELECT id FROM transactions WHERE id=$1", [1]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such transaction", async function () {
    try {
      await Transaction.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
