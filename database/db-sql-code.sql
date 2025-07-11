-- SQL Server does not support ENUM types; use a CHECK constraint or a lookup table instead.
CREATE TABLE account_type (
    type_name VARCHAR(20) PRIMARY KEY
);

INSERT INTO account_type (type_name) VALUES
    ('Client'),
    ('Employee'),
    ('Admin');
