CREATE TYPE Publicublic.account_type AS ENUM
    ('Client', 'Employee', 'Admin');

ALTER TYPE  Public.account_type
    OWNER TO demo123;
