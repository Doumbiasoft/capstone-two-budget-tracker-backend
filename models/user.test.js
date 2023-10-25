"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
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

/************************************** authenticate */

describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("expense1@tracker.com", "password1");
    expect(user).toEqual({
      id: testUserIds[0],
      email: "expense1@tracker.com",
      firstName: "User1First",
      lastName: "User1Last",
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("ranker@tracker.com", "password1");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("expense1@tracker.com", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** register */

describe("register", function () {
  const newUser = {
    email: "tester@tracker.com",
    firstName: "Test",
    lastName: "Tester",
  };

  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "password5",

    });
    const finalnewUser ={...newUser,id:"4"} 
    expect(user).toEqual(finalnewUser);
    const found = await db.query("SELECT * FROM users WHERE email = 'tester@tracker.com'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });


  test("bad request with duplicated data", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works", async function () {
    const users = await User.findAll();

    expect(users).toEqual([
      {
        id: testUserIds[0],
        firstName: "User1First",
        lastName: "User1Last",
        email: "expense1@tracker.com",
      },
      {
        id: testUserIds[1],
        firstName: "User2First",
        lastName: "User2Last",
        email: "expense2@tracker.com",
      },
      {
        id: testUserIds[2],
        firstName: "User3First",
        lastName: "User3Last",
        email: "expense3@tracker.com",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let user = await User.get(testUserIds[0]);

    expect(user).toEqual({
        id: testUserIds[0],
        firstName: "User1First",
        lastName: "User1Last",
        email: "expense1@tracker.com",
        categories: [
            { id: testCategoriesIds[0].id, userId: testCategoriesIds[0].userId, name: 'Salary', type: 'Income' },
            { id: testCategoriesIds[1].id, userId: testCategoriesIds[1].userId, name: 'Rent', type: 'Expense' },
            { id: testCategoriesIds[2].id, userId: testCategoriesIds[2].userId, name: 'Groceries', type: 'Expense' }
        ]
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    firstName: "User1FirstUpdate",
    lastName: "User1LastUpdate",
    email: "expense1@tracker.com",
  };

  test("works", async function () {
    let user = await User.update(testUserIds[0], updateData);

    expect(user).toEqual({
      id: testUserIds[0],
      ...updateData,
    });
  });

  test("works: set password", async function () {
    let user = await User.update(testUserIds[0], {
      password: "new",
    });

    expect(user).toEqual({
        id: testUserIds[0],
        firstName: "User1First",
        lastName: "User1Last",
        email: "expense1@tracker.com",
    });
    const found = await db.query(`SELECT * FROM users WHERE id = $1`,[testUserIds[0]]);
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("not found if no such user", async function () {
    try {
      await User.update(0, {
        firstName: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await User.update(testUserIds[0], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await User.remove(testUserIds[0]);
    const res = await db.query(
        `SELECT * FROM users WHERE id=$1`,[testUserIds[0]]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
     await User.remove(0);
     fail();
    } catch (err) {
        console.log("Error--user--remove-notFound: ",err);

      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

