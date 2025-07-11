-- DROP TYPE IF EXISTS public.account_type;

-- SQL Server does not support ENUM types; use a CHECK constraint or a reference table instead.
CREATE TABLE account_type (
    type_name VARCHAR(20) PRIMARY KEY CHECK (type_name IN ('Client', 'Employee', 'Admin'))
);

-- ALTER TYPE is not supported in SQL Server; removed for compatibility.
