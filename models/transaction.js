"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for transactions. */

class Transaction {
  /** Create a transaction (from data), update db, return new transaction data.
   *
   * data should be { category_id, user_id, amount, date, note }
   *
   * Returns { id, category_id, user_id, amount, date, note }
   **/

  static async create(data) {
    const preCheckUser = await db.query(
      `SELECT id
       FROM users
       WHERE id = $1`, [data.user_id]);
    const user = preCheckUser.rows[0];

  if (!user) throw new NotFoundError(`No user: ${data.user_id}`);

    const result = await db.query(
          `INSERT INTO transactions (category_id, user_id, amount, date, note)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, category_id, user_id, amount, date, note`,
        [
          data.category_id,
          data.user_id,
          data.amount,
          data.date,
          data.note,
        ]);
    let transaction = result.rows[0];

    return transaction;
  }

  /** Find all current user transactions (user_id).
   *
   *
   * Returns [{ id, category_id, user_id, amount, date, note, category_name ,category_type}, ...]
   * */

  static async findAll(user_id) {
    const preCheckUser = await db.query(
      `SELECT id
       FROM users
       WHERE id = $1`, [user_id]);
    const user = preCheckUser.rows[0];

  if (!user) throw new NotFoundError(`No user: ${user_id}`);

    const transactions = await db.query(
        `SELECT t.id, t.category_id, t.user_id, t.amount, t.date, t.note, c.name AS "category_name", c.type AS "category_type"
         FROM transactions AS t
         LEFT JOIN categories AS c ON t.category_id = c.id
         WHERE t.user_id = $1`, [user_id]);
    return transactions.rows;
  }

  /** Given a transaction id and user_id, return data about transaction.
   *
   * Returns { id, category_id, user_id, amount, date, note, category_name ,category_type}
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id, user_id) {
    const preCheckUser = await db.query(
      `SELECT id
       FROM users
       WHERE id = $1`, [user_id]);
    const user = preCheckUser.rows[0];

  if (!user) throw new NotFoundError(`No user: ${user_id}`);
    const result = await db.query(
        `SELECT t.id, t.category_id, t.user_id, t.amount, t.date, t.note, c.name AS "category_name", c.type AS "category_type"
         FROM transactions AS t
         LEFT JOIN categories AS c ON t.category_id = c.id
         WHERE t.id=$1 AND t.user_id = $2`, [id, user_id]);

    const transaction = result.rows[0];

    if (!transaction) throw new NotFoundError(`No transaction: ${id}`);

    return transaction;
  }

  /** Update transaction data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { category_id, amount, date, note }
   *
   * Returns { id, category_id, user_id, amount, date, note }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
 
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE transactions 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx}
                      RETURNING id, 
                                category_id, 
                                user_id, 
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
