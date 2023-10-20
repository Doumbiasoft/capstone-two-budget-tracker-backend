"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** libs */
const cultureInfo = require("../libs/culture_info.js");
const customGroupBy = require("../libs/customGroupBy.js");


/** Related functions for users. */

class User {
  /** authenticate user with email, password.
   *
   * Returns {id, firstName, lastName, email }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(email, password) {
    // try to find the user first
    const result = await db.query(
          `SELECT id, email,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName"
           FROM users
           WHERE email = $1`,
        [email],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid email/password");
  }

  /** Register user with data.
   *
   * Returns { id, firstName, lastName, email }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({ email, password, firstName, lastName }) {
    const duplicateCheck = await db.query(
          `SELECT email
           FROM users
           WHERE email = $1`,
        [email],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate email: ${email}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
          `INSERT INTO users
           (email,
            password,
            first_name,
            last_name)
           VALUES ($1, $2, $3, $4)
           RETURNING id, email, first_name AS "firstName", last_name AS "lastName"`,
        [
          email,
          hashedPassword,
          firstName,
          lastName
        ],
    );
    
    const user = result.rows[0];
    return user;
  }

  /** Find all users.
   *
   * Returns [{id, firstName, lastName, email }, ...]
   **/

  static async findAll() {
    const result = await db.query(
          `SELECT id, email,
                  first_name AS "firstName",
                  last_name AS "lastName"
           FROM users
           ORDER BY firstName`,
    );

    return result.rows;
  }

  /** Given an email, return data about user.
   *
   * Returns { email, firstName, lastName, transactions, categories }
   *   where transaction is { id, category_id, user_id, amount, date, note, category_name ,category_type}
   *   where category is { id, user_id, name, type}
   * 
   * Throws NotFoundError if user not found.
   **/

  static async get(id) {
    const userRes = await db.query(
          `SELECT id, email,
                  first_name AS "firstName",
                  last_name AS "lastName"
           FROM users
           WHERE id = $1`,
        [id],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user with id: ${id}`);

    const userCategories = await db.query(
      `SELECT id, user_id AS "userId", name, type
       FROM categories
       WHERE user_id = $1`, [user.id]);

    // const userTransactions =  db.query(
    //       `SELECT t.id, t.category_id AS "categoryId", t.user_id AS "userId", t.amount, t.date, t.note, c.name AS "categoryName", c.type AS "categoryType"
    //        FROM transactions AS t
    //        LEFT JOIN categories AS c ON t.category_id = c.id
    //        WHERE t.user_id = $1`, [user.id]);

    //const requests = await Promise.all([userCategories, userTransactions]);
    //user.transactions = requests[1].rows;

    user.categories = userCategories.rows;

    return user;
  }
   /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { firstName, lastName, password, type }
   *
   * Returns {id, firstName, lastName, email }
   *
   * Throws NotFoundError if not found.
   */

   static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          firstName: "first_name",
          lastName: "last_name",
        });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx}
                      RETURNING id, email, first_name AS "firstName", last_name AS "lastName"`;
    const result = await db.query(querySql, [...values, id]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${id}`);
    return user;
  }

   /** Delete given user from database; returns undefined.
   *
   * Throws NotFoundError if user not found.
   **/

   static async remove(id) {
    const result = await db.query(
        `DELETE
         FROM users
         WHERE id = $1
         RETURNING id`, [id]);
    const user = result.rows[0];
    delete user.password;
    if (!user) throw new NotFoundError(`No user: ${id}`);
  }

  /**Dashboard
   * 
   */
  static async getDashboard(userId){

    let dataDashboard={};
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);
    const endDate = today;
    
    /* Last seven days transitions */
    const result =  db.query(
      `SELECT t.id, t.category_id AS "categoryId", t.user_id AS "userId", t.amount, t.date, t.note, c.name AS "categoryName", c.type AS "categoryType"
       FROM transactions AS t
       LEFT JOIN categories AS c ON t.category_id = c.id
       WHERE t.user_id = $1 AND (t.date >=$2 AND t.date <= $3)`, [userId, startDate, endDate]);

    /* Recent Transactions */
    const resultRecentTransactions =  db.query(
      `SELECT t.id, t.category_id AS "categoryId", t.user_id AS "userId", t.amount, t.date, t.note, c.name AS "categoryName", c.type AS "categoryType"
       FROM transactions AS t
       LEFT JOIN categories AS c ON t.category_id = c.id
       WHERE t.user_id = $1 ORDER BY t.date DESC LIMIT 5`, [userId]);

    const requests = await Promise.all([result, resultRecentTransactions])
    
    const SelectedTransactions = requests[0].rows;
    dataDashboard.lastSevenTransactions = SelectedTransactions.map((row) => {
      return { ...row, amount: row.amount};
    });




    /* Total Income */
    const TotalIncome = SelectedTransactions.filter((x)=> x.categoryType === "Income").reduce((prev, next) => +prev + +next.amount, 0);
    dataDashboard.totalIncome = TotalIncome;

    /* Total Expenses */
    const TotalExpense = SelectedTransactions.filter((x)=> x.categoryType === "Expense").reduce((prev, next) => +prev + +next.amount, 0);
    dataDashboard.totalExpense = TotalExpense;

    /* Balance calculation */
    const Balance = TotalIncome - TotalExpense;

    const formattedBalance = cultureInfo.format(Balance);
    dataDashboard.balance = Balance;

    /* Doughnut Chart - Expense By Category */
    /* Filter and group transactions */
    const groupedTransactionsExpense = customGroupBy(SelectedTransactions.filter((x) => x.categoryType === "Expense"), (item) => item.categoryId);

    /* Process and sort the grouped data */
    const DoughnutChartData = Object.values(groupedTransactionsExpense).map((group) => ({
      categoryName: group[0].categoryName,
      amount: group.reduce((prev, next) => +prev + +next.amount, 0),
      formattedAmount: cultureInfo.format(group.reduce((prev, next) => +prev + +next.amount, 0)),
    })).sort((a, b) => a.amount - b.amount);

    dataDashboard.doughnutChartData = DoughnutChartData;

    /* Spline Chart - Income vs Expense */

    /* SplineChartData */
    /* Income */
    const groupedTransactionsIncomeByDate = customGroupBy(SelectedTransactions.filter((x) => x.categoryType === "Income"), (item) => item.date);
    const IncomeSummary = Object.values(groupedTransactionsIncomeByDate).map((group) => ({
      day: group[0].date,
      income: group.reduce((prev, next) => +prev + +next.amount, 0)
    }));
    
    
    /* Expense*/
    const groupedTransactionsExpenseByDate = customGroupBy(SelectedTransactions.filter((x) => x.categoryType === "Expense"), (item) => item.date);
    const ExpenseSummary = Object.values(groupedTransactionsExpenseByDate).map((group) => ({
      day: group[0].date,
      expense: group.reduce((prev, next) => +prev + +next.amount, 0)
    }));


    /* Generate an array of the last 7 days in the "dd-MMM" format */
    const Last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const day = date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
      return day;
    });

    const SplineChartData = Last7Days.map((day) => {
      const income = IncomeSummary.find((item) => item.day.toLocaleDateString("en-US", { day: "2-digit", month: "short" }) === day) || { income: 0 };
      const expense = ExpenseSummary.find((item) => item.day.toLocaleDateString("en-US", { day: "2-digit", month: "short" }) === day) || { expense: 0 };
      return {
        day: day,
        income: income.income,
        expense: expense.expense,
      };
    });

    dataDashboard.splineChartData = SplineChartData;

    /* Recent Transactions */
    const RecentTransactions = requests[1].rows;
    dataDashboard.recentTransactions = RecentTransactions.map((row) => {
      return { ...row, amount: row.amount, date: row.date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) };
    });

    return dataDashboard;
  }
  
}

module.exports = User;
