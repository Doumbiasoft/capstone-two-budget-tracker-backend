"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Category = require("../models/category");
const Transaction = require("../models/transaction");
const { createToken } = require("../helpers/tokens");

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

   await User.register({
    email: "expense1@tracker.com",
    password: "password1",
    firstName: "User1First",
    lastName: "User1Last",
  });
  testUserIds[0]=1;

  await User.register({
    email: "expense2@tracker.com",
    password: "password2",
    firstName: "User2First",
    lastName: "User2Last",
  });
  testUserIds[1] = 2;

 await User.register({
    email: "expense3@tracker.com",
    password: "password3",
    firstName: "User3First",
    lastName: "User3Last",
  });
  testUserIds[2] = 3;


    const cat0 = (await Category.create({ name: "Salary", type: "Income",userId: testUserIds[0]}));
    testCategoriesIds[0] = {id: cat0.id, userId: cat0.userId};
        
    const cat1 = (await Category.create({ name: "Rent", type: "Expense",userId: testUserIds[0]}));
    testCategoriesIds[1]= {id: cat1.id, userId: cat1.userId};

    const cat2 = (await Category.create({ name: "Groceries", type: "Expense",userId: testUserIds[0]}));
    testCategoriesIds[2]= {id: cat2.id, userId: cat2.userId};
        
    const cat3 = (await Category.create({ name: "Salary", type: "Income",userId: testUserIds[1]}));
    testCategoriesIds[3]= {id: cat3.id, userId: cat3.userId};
        
    const cat4 = (await Category.create({ name: "Rent", type: "Expense",userId: testUserIds[1]}));
    testCategoriesIds[4]= {id: cat4.id, userId: cat4.userId};
    
    const cat5 = (await Category.create({ name: "Groceries", type: "Expense",userId: testUserIds[1]}));
    testCategoriesIds[5]= {id: cat5.id, userId: cat5.userId};
        
    const cat6 = (await Category.create({ name: "Salary", type: "Income",userId: testUserIds[2]}));
    testCategoriesIds[6]= {id: cat6.id, userId: cat6.userId};
        
    const cat7 = (await Category.create({ name: "Rent", type: "Expense",userId: testUserIds[2]}));
    testCategoriesIds[7]= {id: cat7.id, userId: cat7.userId};
        
    const cat8 = (await Category.create({ name: "Groceries", type: "Expense",userId: testUserIds[2]}));
    testCategoriesIds[8]= {id: cat8.id, userId: cat8.userId};

    console.log("OOOOOO:",testCategoriesIds[0].id);
    console.log("111111:",testCategoriesIds[0].userId);
       
   await Transaction.create({
            categoryId: testCategoriesIds[0].id,
            userId: testCategoriesIds[0].userId,
            amount: "7500",
            date: "2023-09-18",
            note: ""
          });

          await Transaction.create({
            categoryId: testCategoriesIds[1].id,
            userId: testCategoriesIds[1].userId,
            amount: "1200",
            date: "2023-09-19",
            note: "",
          });
          await Transaction.create({
            categoryId: testCategoriesIds[2].id,
            userId: testCategoriesIds[2].userId,
            amount: "180",
            date: "2023-09-20",
            note: "",
          });
          await Transaction.create({
            categoryId: testCategoriesIds[3].id,
            userId: testCategoriesIds[3].userId,
            amount: "3500",
            date: "2023-09-18",
            note: "",
          });
          await Transaction.create({
            categoryId: testCategoriesIds[4].id,
            userId: testCategoriesIds[4].userId,
            amount: "800",
            date: "2023-09-19",
            note: "",
          });
          await Transaction.create({
            categoryId: testCategoriesIds[5].id,
            userId: testCategoriesIds[5].userId,
            amount: "30",
            date: "2023-09-20",
            note: "",
          });
          await Transaction.create({
            categoryId: testCategoriesIds[6].id,
            userId: testCategoriesIds[6].userId,
            amount: "1500",
            date: "2023-09-18",
            note: "",
          });
          await Transaction.create({
            categoryId: testCategoriesIds[7].id,
            userId: testCategoriesIds[7].userId,
            amount: "90",
            date: "2023-09-19",
            note: "",
          });
          await Transaction.create({
            categoryId: testCategoriesIds[8].id,
            userId: testCategoriesIds[8].userId,
            amount: "20",
            date: "2023-09-20",
            note: "",
          });
    


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


const uToken = createToken({
  id:"1",
  email: "expense1@tracker.com",
  password: "password1",
  firstName: "User1First",
  lastName: "User1Last",
});

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testCategoriesIds,
  uToken
};