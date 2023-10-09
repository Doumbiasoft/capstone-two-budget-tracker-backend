"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for transactions. */

class Transaction {
  /** Create a transaction (from data), update db, return new transaction data.
   *
   * data should be { categoryId, userId, amount, date, note }
   *
   * Returns { id, categoryId, userId, amount, date, note }
   **/

  static async create(data) {
    const preCheckUser = await db.query(
      `SELECT id
       FROM users
       WHERE id = $1`, [data.userId]);
    const user = preCheckUser.rows[0];

  if (!user) throw new NotFoundError(`No user: ${data.userId}`);

    const result = await db.query(
          `INSERT INTO transactions (category_id, user_id, amount, date, note)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, category_id AS "categoryId", user_id AS "userId", amount, date, note`,
        [
          data.categoryId,
          data.userId,
          data.amount,
          data.date,
          data.note,
        ]);
    let transaction = result.rows[0];

    return transaction;
  }

  /** Find all current user transactions (userId).
   *
   *
   * Returns [{ id, categoryId, userId, amount, date, note, categoryName ,categoryType}, ...]
   * */

  static async findAll(userId) {
    const preCheckUser = await db.query(
      `SELECT id
       FROM users
       WHERE id = $1`, [userId]);
    const user = preCheckUser.rows[0];

  if (!user) throw new NotFoundError(`No user: ${userId}`);

    const transactions = await db.query(
        `SELECT t.id, t.category_id AS "categoryId", t.user_id AS "userId", t.amount, t.date, t.note, c.name AS "categoryName", c.type AS "categoryType"
         FROM transactions AS t
         LEFT JOIN categories AS c ON t.category_id = c.id
         WHERE t.user_id = $1`, [userId]);
    return transactions.rows;
  }

  /** Given a transaction id and userId, return data about transaction.
   *
   * Returns { id, categoryId, userId, amount, date, note, categoryName ,categoryType}
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id, userId) {
    const preCheckUser = await db.query(
      `SELECT id
       FROM users
       WHERE id = $1`, [userId]);
    const user = preCheckUser.rows[0];

  if (!user) throw new NotFoundError(`No user: ${userId}`);
    const result = await db.query(
       `SELECT t.id, t.category_id AS "categoryId", t.user_id AS "userId", t.amount, t.date, t.note, c.name AS "categoryName", c.type AS "categoryType"
        FROM transactions AS t
        LEFT JOIN categories AS c ON t.category_id = c.id
        WHERE t.id=$1 AND t.user_id = $2`, [id, userId]);

    const transaction = result.rows[0];

    if (!transaction) throw new NotFoundError(`No transaction: ${id}`);

    return transaction;
  }

  /** Update transaction data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { categoryId, amount, date, note }
   *
   * Returns { id, categoryId, userId, amount, date, note }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
 
    const { setCols, values } = sqlForPartialUpdate(
        data,
        { categoryId: "category_id" });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE transactions 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx}
                      RETURNING id, 
                                category_id AS "categoryId",
                                user_id AS "userId",
                                amount, 
                                date, 
                                note`;
    const result = await db.query(querySql, [...values, id]);
    const transaction = result.rows[0];

    if (!transaction) throw new NotFoundError(`No transaction: ${id}`);

    return transaction;
  }

  /** Delete given transaction from database; returns undefined.
   *
   * Throws NotFoundError if transaction not found.
   **/

  static async remove(id) {
 
    const result = await db.query(
        `DELETE
         FROM transactions
         WHERE id = $1
         RETURNING id`, [id]);
    const transaction = result.rows[0];

    if (!transaction) throw new NotFoundError(`No transaction: ${id}`);
  }
}

module.exports = Transaction;
