"use strict";

const jwt = require("jsonwebtoken");
const { createToken } = require("./tokens");
const { SECRET_KEY } = require("../config");

describe("createToken", function () {

  test("works: default", function () {
    const token = createToken({ email: "expense@tracker.com", id:1 });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      email: "expense@tracker.com",
      id: 1,
    });
  });
});
