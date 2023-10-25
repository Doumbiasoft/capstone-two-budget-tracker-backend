"use strict";

describe("config can come from env", function () {
  test("works", function() {
    process.env.SECRET_KEY = "s6re9hyutelSKCyMfWY";
    process.env.PORT = "3001";
    process.env.DATABASE_URL = "postgresql:///expense_tracker_db";
    process.env.NODE_ENV = "production";

    const config = require("./config");
    expect(config.SECRET_KEY).toEqual("s6re9hyutelSKCyMfWY");
    expect(config.PORT).toEqual(3001);
    expect(config.getDatabaseUri()).toEqual("postgresql:///expense_tracker_db");
    expect(config.BCRYPT_WORK_FACTOR).toEqual(12);

    delete process.env.SECRET_KEY;
    delete process.env.PORT;
    delete process.env.BCRYPT_WORK_FACTOR;
    delete process.env.DATABASE_URL;

    expect(config.getDatabaseUri()).toEqual("postgresql:///expense_tracker_db");
    process.env.NODE_ENV = "test";

    expect(config.getDatabaseUri()).toEqual("postgresql:///expense_tracker_test_db");
  });
})

