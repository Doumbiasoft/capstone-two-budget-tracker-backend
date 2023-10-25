"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for categories. */

class Category {
  /** Create a category (from data), update db, return new category data.
   *
   * data should be {userId, name, type}
   *
   * Returns { id, userId, name, type }
   **/

  static async create(data) {
    const preCheckUser = await db.query(
      `SELECT id
       FROM users
       WHERE id = $1`, [data.userId]);
    const user = preCheckUser.rows[0];

  if (!user) throw new NotFoundError(`No user: ${data.userId}`);

  if (data.type!=="Expense" && data.type!=="Income") throw new NotFoundError(`The category type should be: Expense OR Income`);


    const result = await db.query(
          `INSERT INTO Categories (user_id, name, type)
           VALUES ($1, $2, $3)
           RETURNING id, user_id AS "userId", name, type`,
        [
          data.userId,
          data.name,
          data.type,
        ]);
    let category = result.rows[0];
    return category;
  }

  /** Find all categories by current user id (id).
   *
   *
   * Returns [{ id, userId, name, type}, ...]
   * */

  static async findAll(userId) {
    const preCheckUser = await db.query(
      `SELECT id
       FROM users
       WHERE id = $1`, [userId]);
    const user = preCheckUser.rows[0];

  if (!user) throw new NotFoundError(`No user: ${userId}`);

    const result = await db.query(
        `SELECT id,
            user_id AS "userId",
            name,
            type
        FROM categories WHERE user_id =$1`,[userId]);

  return result.rows;
  }

  /** Given a category id, return data about category.
   *
   * Returns { id, userId, name, type }
   *  
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
        `SELECT id,
            user_id AS "userId",
            name,
            type
        FROM categories WHERE id =$1 AND user_id =$2`,[id, userId]);

    const category = result.rows[0];
    return category;
  }

  /** Update category data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { name, type }
   *
   * Returns { id, userId, name, type }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    if(!data) throw new BadRequestError();
    if (data.type!=="Expense" && data.type!=="Income") throw new NotFoundError(`The category type should be: Expense OR Income`);

    const { setCols, values } = sqlForPartialUpdate(
        data,
        {userId: "user_id"});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE categories 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx}
                      RETURNING id, 
                                user_id AS "userId",
                                name, 
                                type`;
    const result = await db.query(querySql, [...values, id]);
    const category = result.rows[0];

    if (!category) throw new NotFoundError(`No category: ${id}`);
    return category;
  }

  /** Delete given category from database; returns undefined.
   *
   * Throws NotFoundError if category not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM categories
           WHERE id = $1
           RETURNING id`, [id]);
    const category = result.rows[0];

    if (!category) throw new NotFoundError(`No category: ${id}`);

  }
}

module.exports = Category;
