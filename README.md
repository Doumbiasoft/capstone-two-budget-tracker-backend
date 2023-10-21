# Capstone two: Expense Tracker Api (Back-End)

## Unit 50 Capstone 2

>Create a personal finance app for tracking income, expenses. Implement data visualization to help users analyze their financial trends.
>**Host:** **[Render.com](https://render.com)**
>**The JSON REST API is online at:**
>**https://expense-tracker-backend-jnmy.onrender.com**

**DATABASE SCHEMA**:
![Img-Light](documentation/medias/images/expense_tracker_database_schema_light.png#gh-light-mode-only)![Img-Dark](documentation/medias/images/expense_tracker_database_schema_dark.png#gh-dark-mode-only)

## JSON REST API components:
This application has been created using the following components:
- **NodeJS**
- **Express** as a framework
- **Posgtres sql** as a Database

## Getting Started
To use this application, you will need to download and install [NodeJS](http://nodejs.org/download/).

Once you have NodeJS installed, you have two choices for downloading this source code:

1. Download & extract a [zip file](https://github.com/doumbiasoft/capstone-two-budget-tracker-backend/archive/master.zip) of the source
2. Fork this repository and git clone your fork

Next, you need to install the package dependencies by running the following command in the top-level directory of this source tree:
``` bash
npm install
```
Create the database with the following command:
``` bash
npm create-db
```

Once the dependancies are installed, you can start the application server by running
``` bash
npm start
```

Once the server is running, you can access to the API by opening your browser to [http://localhost:3001](http://localhost:3001).

To stop the server, press CTRL-C.

## REST API

The URL BASE JSON REST API is exposed at [http://localhost:3001](http://localhost:3001).

#### API Endpoints
#### => authentication
* **/auth**
HTTP **POST**: authenticate a user
```json
{
    "email":"expense_tracker@ymail.com",
    "password":"motdepasse",
}
``` 
And return a **token**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjciLCJlbWFpbCI6ImRvdW1iaWFzb2Zsgtrez0QGdtYWlsLmNvbSIsImlhdCI6MTY5Njg4ODc3MH0.LUQ8afTfwe8ybL-C8QN7zX2jokBBEgweLYvHTjncmF0"
}
```
* **/auth/register**
HTTP **POST**: register a new user
```json
{
    "firstName": "Mouhamed",
    "lastName": "Doumbia",
    "email":"expense_tracker@ymail.com",
    "password":"motdepasse"
}
``` 
#### => users
* **/users/:id**  
HTTP **GET**: returns the user with given id (numeric, auto-incrementing).  HTTP 404 if user not found 
```json
{
    "user": {
        "id": "7",
        "email": "doumbiasoft@gmail.com",
        "firstName": "Mouhamed",
        "lastName": "Doumbia",
        "transactions": [
            {
                "id": "6",
                "categoryId": "42",
                "userId": "7",
                "amount": "100.00",
                "date": "2023-10-05T04:00:00.000Z",
                "note": "My groceries",
                "categoryName": "Groceries",
                "categoryType": "Expense"
            },
            {
                "id": "5",
                "categoryId": "51",
                "userId": "7",
                "amount": "5000.00",
                "date": "2023-10-06T04:00:00.000Z",
                "note": "My Salary",
                "categoryName": "Salary",
                "categoryType": "Income"
            }
        ],
        "categories": [
            {
                "id": "36",
                "userId": "7",
                "name": "Car",
                "type": "Expense"
            },
            {
                "id": "37",
                "userId": "7",
                "name": "Children",
                "type": "Expense"
            }
        ]
    }
}
```
* HTTP **PATCH**: updates the user with given id and returns updated record. HTTP 404 if user not fund.
```json
{
    "email": "expense_tracker@ymail.com",
    "firstName": "Mouhamed Lamine",
    "lastName": "Doumbia"
}
```
* HTTP **DELETE**: removes the users with given id, returns the deleted id (HTTP 204)
* **users/:id/dashboard**
HTTP **GET**: get the user dashboard data

Here is an example of results returned from HTTP GET on **/users/:id/dashboard**:
```json
{
    "dashboard": {
        "lastSevenTransactions": [
            {
                "id": "6",
                "categoryId": "42",
                "userId": "7",
                "amount": "$100",
                "date": "2023-10-05T04:00:00.000Z",
                "note": "My groceries",
                "categoryName": "Groceries",
                "categoryType": "Expense"
            },
            {
                "id": "5",
                "categoryId": "51",
                "userId": "7",
                "amount": "$5,000",
                "date": "2023-10-06T04:00:00.000Z",
                "note": "My Salary",
                "categoryName": "Salary",
                "categoryType": "Income"
            },
            {
                "id": "7",
                "categoryId": "41",
                "userId": "7",
                "amount": "$20.45",
                "date": "2023-10-04T04:00:00.000Z",
                "note": "Cinema",
                "categoryName": "Entertainment",
                "categoryType": "Expense"
            }
        ],
        "totalIncome": "$5,000",
        "totalExpense": "$120.45",
        "balance": "$4,879.55",
        "doughnutChartData": [
            {
                "categoryName": "Entertainment",
                "amount": 20.45,
                "formattedAmount": "$20.45"
            },
            {
                "categoryName": "Groceries",
                "amount": 100,
                "formattedAmount": "$100"
            }
        ],
        "splineChartData": [
            {
                "day": "Oct 03",
                "income": 0,
                "expense": 0
            },
            {
                "day": "Oct 04",
                "income": 0,
                "expense": 20.45
            },
            {
                "day": "Oct 05",
                "income": 0,
                "expense": 100
            },
            {
                "day": "Oct 06",
                "income": 5000,
                "expense": 0
            },
            {
                "day": "Oct 07",
                "income": 0,
                "expense": 0
            },
            {
                "day": "Oct 08",
                "income": 0,
                "expense": 0
            },
            {
                "day": "Oct 09",
                "income": 0,
                "expense": 0
            }
        ],
        "recentTransactions": [
            {
                "id": "5",
                "categoryId": "51",
                "userId": "7",
                "amount": "$5,000",
                "date": "Oct 06, 2023",
                "note": "My Salary",
                "categoryName": "Salary",
                "categoryType": "Income"
            },
            {
                "id": "6",
                "categoryId": "42",
                "userId": "7",
                "amount": "$100",
                "date": "Oct 05, 2023",
                "note": "My groceries",
                "categoryName": "Groceries",
                "categoryType": "Expense"
            },
            {
                "id": "7",
                "categoryId": "41",
                "userId": "7",
                "amount": "$20.45",
                "date": "Oct 04, 2023",
                "note": "Cinema",
                "categoryName": "Entertainment",
                "categoryType": "Expense"
            }
        ]
    }
}
```
#### => categories
* **/categories**
HTTP **POST**: create a category (The type should be **"Expense"** or **"Income"**).
```json
{
    "userId":"7",
    "name":"sell",
    "type":"Income"
}
```
* **/categories/users/:userId**
HTTP **GET**: get all categories for a specific user.
Here is an example of results returned from HTTP GET on **/categories/users/:userId**:
```json
{
    "categories": [
        {
            "id": "44",
            "userId": "7",
            "name": "Healthcare",
            "type": "Expense"
        },
        {
            "id": "45",
            "userId": "7",
            "name": "Home",
            "type": "Expense"
        },
        {
            "id": "46",
            "userId": "7",
            "name": "Insurance",
            "type": "Expense"
        },
        {
            "id": "47",
            "userId": "7",
            "name": "Loans",
            "type": "Expense"
        },
        {
            "id": "51",
            "userId": "7",
            "name": "Salary",
            "type": "Income"
        }
    ]
}
```
* **/categories/:id/users/:userId**
HTTP **GET**: get a category for a specific user.
Here is an example of results returned from HTTP GET on **/categories/:id/users/:userId**:
```json
{
    "category": {
        "id": "51",
        "userId": "7",
        "name": "Salary",
        "type": "Income"
    }
}
```

* **/categories/:id**
HTTP **PATCH**: update a category.
```json
{
    "name":"Internet Bill",
    "type":"Expense"
}
```
* HTTP **DELETE**: delete a category and return the id of item deleted.

#### => transactions
* **/transactions**
HTTP **POST**: create a transaction.
```json
{
    "userId":"7",
    "categoryId":"41",
    "amount":"11",
    "date":"2023-10-09",
    "note":"Youtube"
}
```
* HTTP **PATCH**: update a transaction.
* **/transactions/:id**
```json
{
    "categoryId":"41",
    "amount":"25",
    "date":"2023-10-08",
    "note":"Internet Verizon"
}
```
* **/transactions/users/:userId**
HTTP **GET**: get all transaction for a user.
Here is an example of results returned from HTTP GET on **/transactions/users/:userId**:
```json
{
    "transactions": [
        {
            "id": "6",
            "categoryId": "42",
            "userId": "7",
            "amount": "100.00",
            "date": "2023-10-05T04:00:00.000Z",
            "note": "My groceries",
            "categoryName": "Groceries",
            "categoryType": "Expense"
        },
        {
            "id": "5",
            "categoryId": "51",
            "userId": "7",
            "amount": "5000.00",
            "date": "2023-10-06T04:00:00.000Z",
            "note": "My Salary",
            "categoryName": "Salary",
            "categoryType": "Income"
        },
        {
            "id": "7",
            "categoryId": "41",
            "userId": "7",
            "amount": "20.45",
            "date": "2023-10-04T04:00:00.000Z",
            "note": "Cinema",
            "categoryName": "Entertainment",
            "categoryType": "Expense"
        }
    ]
}
```
* **/transactions/:id/users/:userId**
HTTP **GET**: get a transaction for a user.
Here is an example of results returned from HTTP GET on **/transactions/:id/users/:userId**:
```json
{
    "transaction": {
        "id": "5",
        "categoryId": "51",
        "userId": "7",
        "amount": "5000.00",
        "date": "2023-10-06T04:00:00.000Z",
        "note": "My Salary",
        "categoryName": "Salary",
        "categoryType": "Income"
    }
}
```
* **/transactions/:id**
HTTP **DELETE**: delete a transaction for a user and return deleted item id.
