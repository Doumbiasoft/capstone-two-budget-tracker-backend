"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

const User = require("../models/user");
const Category = require("../models/category");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const oAuth = require("../schemas/oAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");

let categories = require('../init_categories_data.json').data;

/** POST /auth/token:  { email, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const { email, password } = req.body;
    const user = await User.authenticate(email, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/oauth:  { firstName, lastName, email , oauthId, oauthProvider, oauthPicture } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/oauth", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, oAuth);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.oauth(req.body);

    if (newUser.IsNew) {
      const userId = newUser.id;
      for (let cat of categories) {
        await Category.create({ ...cat, userId });
      }
    }
    const token = createToken(newUser);
    return newUser.IsNew ? res.status(201).json({ token }) : res.json({ token });

  } catch (err) {
    return next(err);
  }
});


/** POST /auth/register:   { user } => { token }
 *
 * user must include { email, password, firstName, lastName }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register({ ...req.body });
    if (newUser) {
      const userId = newUser.id;
      for (let cat of categories) {
        await Category.create({ ...cat, userId });
      }
    }
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
