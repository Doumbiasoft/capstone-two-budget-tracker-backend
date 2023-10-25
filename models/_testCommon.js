const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testUserIds = [];
const testCategoriesIds = [];

async function commonBeforeAll() {
  /* no inspection SqlWithoutWhere */
  await db.query("DELETE FROM transactions");
  await db.query("DELETE FROM categories");
  await db.query("DELETE FROM users");
  await db.query('ALTER SEQUENCE transactions_id_seq RESTART WITH 1');
  await db.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
  await db.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');

const resultsUsers = await db.query(
`INSERT INTO users
    (email, password, first_name, last_name)
    VALUES ('expense1@tracker.com', $1,'User1First', 'User1Last'),
           ('expense2@tracker.com', $2,'User2First', 'User2Last'),
           ('expense3@tracker.com', $3,'User3First', 'User3Last')
    RETURNING id`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password3", BCRYPT_WORK_FACTOR),
    ]);
testUserIds.splice(0, 0, ...resultsUsers.rows.map(r => r.id));

 const resultCategories = await db.query(
    `INSERT INTO Categories (user_id, name, type)
     VALUES ($1, 'Salary', 'Income'),
            ($2, 'Rent', 'Expense'),
            ($3, 'Groceries', 'Expense'),
            ($4, 'Salary', 'Income'),
            ($5, 'Rent', 'Expense'),
            ($6, 'Groceries', 'Expense'),
            ($7, 'Salary', 'Income'),
            ($8, 'Rent', 'Expense'),
            ($9, 'Groceries', 'Expense')
            RETURNING id, user_id AS "userId"`,
        [
            testUserIds[0],
            testUserIds[0],
            testUserIds[0],
            testUserIds[1],
            testUserIds[1],
            testUserIds[1],
            testUserIds[2],
            testUserIds[2],
            testUserIds[2],
        ]);
        testCategoriesIds.splice(0, 0, ...resultCategories.rows.map(r =>({id:r.id, userId:r.userId }) ));


     await db.query(
        `INSERT INTO transactions (category_id, user_id, amount, date, note)
            VALUES ($1, $2, '7500', '2023-09-18', ''),
                    ($3, $4, '1200', '2023-09-19', ''),
                    ($5, $6, '180', '2023-09-20', ''),
                    ($7, $8, '3500', '2023-09-18', ''),
                    ($9, $10, '800', '2023-09-19', ''),
                    ($11, $12, '30', '2023-09-20', ''),
                    ($13, $14, '1500', '2023-09-18', ''),
                    ($15, $16, '90', '2023-09-19', ''),
                    ($17, $18, '20', '2023-09-20', '')
                    `,
        [   
            testCategoriesIds[0].id,
            testCategoriesIds[0].userId,
            testCategoriesIds[1].id,
            testCategoriesIds[1].userId,
            testCategoriesIds[2].id,
            testCategoriesIds[2].userId,

            testCategoriesIds[3].id,
            testCategoriesIds[3].userId,
            testCategoriesIds[4].id,
            testCategoriesIds[4].userId,
            testCategoriesIds[5].id,
            testCategoriesIds[5].userId,


            testCategoriesIds[6].id,
            testCategoriesIds[6].userId,
            testCategoriesIds[7].id,
            testCategoriesIds[7].userId,
            testCategoriesIds[8].id,
            testCategoriesIds[8].userId,


    
        ]);


}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testCategoriesIds,

};