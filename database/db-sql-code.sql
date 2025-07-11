-- Use a VARCHAR column with a CHECK constraint for account_type
CREATE TABLE "public".accounts (
    account_type VARCHAR(20) CHECK (account_type IN ('Client', 'Employee', 'Admin'))
);