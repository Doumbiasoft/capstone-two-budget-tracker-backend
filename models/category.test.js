"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Category = require("./category.js");
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
    let newCategory = {
        userId: testUserIds[0],
        name: "Insurance",
        type: "Expense"
      };
    let category = await Category.create(newCategory);
    delete category.id
    expect(category).toEqual({
      ...newCategory,
    });
  });
});

// /************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let category = await Category.findAll(1);

    expect(category).toEqual([
        { id: testCategoriesIds[0].id, userId: testUserIds[0], name: 'Salary', type: 'Income' },
        { id: testCategoriesIds[1].id, userId: testUserIds[0], name: 'Rent', type: 'Expense' },
        { id: testCategoriesIds[2].id, userId: testUserIds[0], name: 'Groceries', type: 'Expense' }
      ]);
  });

});

// /************************************** get */

describe("get", function () {
  test("works", async function () {
    const categoryId = testCategoriesIds[0].id;
    const userId = testUserIds[0];  
    let category = await Category.get(categoryId,userId);

    expect(category).toEqual({ id: categoryId, userId: userId, name: 'Salary', type: 'Income' });
  });

  test("not found if no such category", async function () {
    try {
      await Category.get(0);
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
        name: "healthCare",
        type: "Expense",
        userId: testUserIds[0],
      };
    let category = await Category.update(testCategoriesIds[0].id, updateData);
    expect(category).toEqual({
      id: testCategoriesIds[0].id,
      ...updateData,
    });
  });

  test("not found if no such category", async function () {
    try {
      await Category.update(0, {
        name: "test",
        userId: testUserIds[0],
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Category.update(testCategoriesIds[0].id, {});
      fail();
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
    }
  });
});

// /************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Category.remove(testCategoriesIds[0].id);
    const res = await db.query(
        "SELECT id FROM categories WHERE id=$1", [testCategoriesIds[0].id]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such category", async function () {
    try {
      await Category.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
