"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const Category = require("../models/category");
const Transaction = require("../models/transaction");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

let categories = require('../init_categories_data.json').data;

/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: {id, firstName, lastName, email }, token }
 *
 * 
 **/

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body);
    if (user){
      const user_id = user.id;
     for(let cat of categories){
      await Category.create({...cat, user_id});
     }
    }
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id] => { user }
 *
   *   Returns { email, first_name, last_name, transactions, categories }
   *   where transaction is { id, category_id, user_id, amount, date, note, category_name }
   *   where category is { id, user_id, name, type}
   * 
 *
 * Authorization required: same user-as-:id
 **/

router.get("/:id", ensureLoggedIn, ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(req.params.id);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns {id, email, firstName, lastName }
 *
 * Authorization required: same-user-as-:id
 **/

router.patch("/:id", ensureLoggedIn, ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.id, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: same-user-as-:id
 **/

router.delete("/:id", ensureLoggedIn, ensureCorrectUser, async function (req, res, next) {
  try {
    await User.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});


router.get("/:id/dashboard", ensureLoggedIn, async function (req, res, next) {
  try {
    const dashboard = await User.getDashboard(req.params.id);
    return res.json({ dashboard });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
