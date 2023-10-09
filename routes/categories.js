"use strict";

/** Routes for categories. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const Category = require("../models/category");
const categoryNewSchema = require("../schemas/categoryNew.json");
const categoryUpdateSchema = require("../schemas/categoryUpdate.json");

const router = express.Router({ mergeParams: true });


/** POST / { category } => { category }
 *
 * category should be { user_id, name, type }
 *
 * Returns { id, user_id, name, type }
 *
 * Authorization required: current user
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, categoryNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const category = await Category.create(req.body);
    return res.status(201).json({ category });
  } catch (err) {
    return next(err);
  }
});

/** GET / =>
 *   { categories: [ { id, user_id, name, type }, ...] }
 *
 * Authorization required: current user
 */


router.get("/users/:user_id", ensureLoggedIn, async function (req, res, next) {
    try {

      const categories = await Category.findAll(req.params.user_id);
      return res.json({ categories });
    } catch (err) {
      return next(err);
    }
  });

/** GET /[category_id] => { category }
 *
 * Returns { id, title, salary, equity, company }
 *   where company is { handle, name, description, numEmployees, logoUrl }
 *
 * Authorization required: none
 */

router.get("/:id/users/:user_id", ensureLoggedIn, async function (req, res, next) {
  try {
    const category = await Category.get(req.params.id, req.params.user_id);
    return res.json({ category });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[categoryId]  { fld1, fld2, ... } => { category }
 *
 * Data can include: { name, type }
 *
 * Returns { id, userId, name, type }
 *
 * Authorization required: current user
 */

router.patch("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, categoryUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const category = await Category.update(req.params.id, req.body);
    return res.json({ category });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: current user
 */

router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    await Category.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
