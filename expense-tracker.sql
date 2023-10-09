\echo 'Delete and recreate expense_tracker db ?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE expense_tracker_db;
CREATE DATABASE expense_tracker_db;
\connect expense_tracker_db

\i expense-tracker-schema.sql

\echo 'Delete and recreate expense_tracker db ?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE expense_tracker_test_db;
CREATE DATABASE expense_tracker_test_db;
\connect expense_tracker_test_db

\i expense-tracker-schema.sql
