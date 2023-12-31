# Capstone two

### App Name: (Expense Tracker)
<!-- ![img](documentation/medias/images/budget-tracker-logo.png) -->

**1. What goal will your website be designed to achieve?**

>Create a personal finance app for tracking income, expenses. Implement data visualization to help users analyze their financial trends.

**2. What kind of users will visit your site? In other words, what is the demographic of your users?**

 >The system will take inputs from all users and who needs to track their finances.

**3. What data do you plan on using? You may have not picked your actual API yet,which is fine, just outline what kind of data you would like it to contain.**

>For this application I'm going to build my own API in **node.js**.

**4. In brief, outline your approach to creating your project (knowing that you may not know everything in advance and that these details might change later). Answer questions like the ones below, but feel free to add more information:**

**a. What does your database schema look like?**
![Img-Light](../documentation/medias/images/expense_tracker_database_schema_light.png#gh-light-mode-only)![Img-Dark](../documentation/medias/images/expense_tracker_database_schema_dark.png#gh-dark-mode-only)

**b. What kinds of issues might you run into with your API?**

>Limit of requests in free subscription

**c. Is there any sensitive information you need to secure?**

>Yes, the User's information like:
>
>Last Name, FirstName, Email, financial information

**d. What functionality will your app include?**

**User authentication and profile creation:**
>Users create accounts to securely access their financial data.

**Expense Tracking:** Users can add, categorize, and describe expenses with dates.

**Income Tracking:** Similarly, users can log income sources and amounts.

**Visualization:** Present data using charts or graphs to help users visualize their financial situation.

**Reports:** Generate detailed financial reports, including income vs. expenses.

**Export Data:** Allow users to export their financial data for tax or personal analysis.


**e. What will the user flow look like?**

- Registration And Authentication
- Set Category
- Add Income
- Add Expenses
- Chart Data
- Export Data

**f. What features make your site more than CRUD?**

- Sign in and up with Email
- Sign in and up using Google

#### Further
Integrate financial services for automated expenses tracker

**Do you have any stretch goals?**