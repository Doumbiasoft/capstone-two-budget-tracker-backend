"use strict";

/** Routes for transactions. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const {ensureLoggedIn } = require("../middleware/auth");
const Transaction = require("../models/transaction");
const transactionNewSchema = require("../schemas/transactionNew.json");
const transactionUpdateSchema = require("../schemas/transactionUpdate.json");

const router = express.Router({ mergeParams: true });


/** POST / { transaction } => { transaction }
 *
 * transaction should be {category_id, user_id, amount, date, note }
 *
 * Returns { id, category_id, user_id, amount, date, note }
 *
 * Authorization required: current user
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, transactionNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const transaction = await Transaction.create(req.body);
    return res.status(201).json({ transaction });
  } catch (err) {
    return next(err);
  }
});

/** GET / =>
 *   { transactions: [ { id, category_id, user_id, amount, date, note, category_name ,category_type}, ...] }
 *
 * Authorization required: current user
 */


router.get("/users/:user_id", ensureLoggedIn, async function (req, res, next) {
    try {

      const transactions = await Transaction.findAll(req.params.user_id);
      return res.json({ transactions });
    } catch (err) {
      return next(err);
    }
  });

/** GET /[transaction_id]/users/[user_id] => { transaction }
 *
 * Returns { id, category_id, user_id, amount, date, note, category_name ,category_type}
 *
 * Authorization required: current user
 */

router.get("/:id/users/:user_id", ensureLoggedIn, async function (req, res, next) {
  try {
    const transaction = await Transaction.get(req.params.id, req.params.user_id);
    return res.json({ transaction });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[transaction_id]/users/[user_id]  { fld1, fld2, ... } => { transaction }
 *
 * Data can include: { category_id, amount, date, note }
 *
 * Returns { id, category_id, user_id, amount, date, note }
 *
 * Authorization required: current user
 */

router.patch("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, transactionUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const transaction = await Transaction.update(req.params.id, req.body);
    return res.json({ transaction });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[handle]  =>  { deleted: id }
 *
 * Authorization required: current user
 */

router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    await Transaction.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
