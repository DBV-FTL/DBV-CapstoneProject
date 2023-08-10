\echo 'Delete and recreate interzine db?'
\prompt 'Return yes or control-C to cancel > ' foo

DROP DATABASE interzine;
CREATE DATABASE interzine;
\connect interzine;


\i interzine-schema.sql

-- \echo 'Delete and recreate interzine db?'
-- \prompt 'Return yes or control-C to cancel > ' foo

-- DROP DATABASE interzine_test;
-- CREATE DATABASE interzine_test;
-- \connect interzine_test

-- \i interzine-schema_test.sql

