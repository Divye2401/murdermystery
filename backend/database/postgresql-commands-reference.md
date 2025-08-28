# PostgreSQL Commands Reference

## Table Operations

| Command        | Purpose          | Example                                      |
| -------------- | ---------------- | -------------------------------------------- |
| `CREATE TABLE` | Create new table | `CREATE TABLE users (id SERIAL, name TEXT);` |
| `DROP TABLE`   | Delete table     | `DROP TABLE users;`                          |
| `ALTER TABLE`  | Modify table     | `ALTER TABLE users ADD COLUMN email TEXT;`   |
| `TRUNCATE`     | Delete all rows  | `TRUNCATE TABLE users;`                      |

## ALTER TABLE Commands

| Command             | Purpose           | Example                                                        |
| ------------------- | ----------------- | -------------------------------------------------------------- |
| `ADD COLUMN`        | Add new column    | `ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;` |
| `DROP COLUMN`       | Remove column     | `ALTER TABLE users DROP COLUMN old_field;`                     |
| `RENAME COLUMN`     | Rename column     | `ALTER TABLE users RENAME COLUMN name TO full_name;`           |
| `ALTER COLUMN TYPE` | Change data type  | `ALTER TABLE users ALTER COLUMN age TYPE BIGINT;`              |
| `ADD CONSTRAINT`    | Add constraint    | `ALTER TABLE users ADD CONSTRAINT check_age CHECK (age >= 0);` |
| `DROP CONSTRAINT`   | Remove constraint | `ALTER TABLE users DROP CONSTRAINT check_age;`                 |
| `RENAME TO`         | Rename table      | `ALTER TABLE users RENAME TO customers;`                       |

## Data Types

| Type          | Description               | Example                                |
| ------------- | ------------------------- | -------------------------------------- |
| `SERIAL`      | Auto-incrementing integer | `id SERIAL PRIMARY KEY`                |
| `UUID`        | Unique identifier         | `id UUID DEFAULT uuid_generate_v4()`   |
| `TEXT`        | Variable length string    | `name TEXT NOT NULL`                   |
| `INTEGER`     | Whole numbers             | `age INTEGER`                          |
| `BOOLEAN`     | True/false                | `is_active BOOLEAN DEFAULT TRUE`       |
| `TIMESTAMPTZ` | Timestamp with timezone   | `created_at TIMESTAMPTZ DEFAULT NOW()` |
| `JSONB`       | Binary JSON (fast)        | `settings JSONB DEFAULT '{}'`          |
| `UUID[]`      | Array of UUIDs            | `user_ids UUID[]`                      |

## Constraints

| Constraint    | Purpose           | Example                             |
| ------------- | ----------------- | ----------------------------------- |
| `PRIMARY KEY` | Unique identifier | `id UUID PRIMARY KEY`               |
| `NOT NULL`    | Required field    | `name TEXT NOT NULL`                |
| `DEFAULT`     | Default value     | `status TEXT DEFAULT 'active'`      |
| `CHECK`       | Validation rule   | `CHECK (age >= 0)`                  |
| `REFERENCES`  | Foreign key       | `user_id UUID REFERENCES users(id)` |
| `UNIQUE`      | Unique values     | `email TEXT UNIQUE`                 |

## CRUD Operations

| Operation  | Command  | Example                                        |
| ---------- | -------- | ---------------------------------------------- |
| **Create** | `INSERT` | `INSERT INTO users (name) VALUES ('John');`    |
| **Read**   | `SELECT` | `SELECT * FROM users WHERE age > 18;`          |
| **Update** | `UPDATE` | `UPDATE users SET name = 'Jane' WHERE id = 1;` |
| **Delete** | `DELETE` | `DELETE FROM users WHERE id = 1;`              |

## Query Operations

| Command    | Purpose        | Example                                                                   |
| ---------- | -------------- | ------------------------------------------------------------------------- |
| `WHERE`    | Filter rows    | `SELECT * FROM users WHERE age > 18;`                                     |
| `ORDER BY` | Sort results   | `SELECT * FROM users ORDER BY name ASC;`                                  |
| `LIMIT`    | Limit results  | `SELECT * FROM users LIMIT 10;`                                           |
| `JOIN`     | Combine tables | `SELECT * FROM users JOIN orders ON users.id = orders.user_id;`           |
| `GROUP BY` | Group results  | `SELECT status, COUNT(*) FROM users GROUP BY status;`                     |
| `HAVING`   | Filter groups  | `SELECT status, COUNT(*) FROM users GROUP BY status HAVING COUNT(*) > 5;` |

## Index Operations

| Command               | Purpose          | Example                                                |
| --------------------- | ---------------- | ------------------------------------------------------ |
| `CREATE INDEX`        | Speed up queries | `CREATE INDEX idx_users_email ON users(email);`        |
| `DROP INDEX`          | Remove index     | `DROP INDEX idx_users_email;`                          |
| `CREATE UNIQUE INDEX` | Unique index     | `CREATE UNIQUE INDEX idx_users_email ON users(email);` |

## JSON Operations (JSONB)

| Operation   | Purpose                | Example                                                                  |
| ----------- | ---------------------- | ------------------------------------------------------------------------ |
| `->`        | Get JSON field         | `SELECT data->'name' FROM users;`                                        |
| `->>`       | Get JSON field as text | `SELECT data->>'name' FROM users;`                                       |
| `@>`        | Contains JSON          | `SELECT * FROM users WHERE data @> '{"active": true}';`                  |
| `?`         | Has key                | `SELECT * FROM users WHERE data ? 'email';`                              |
| `jsonb_set` | Update JSON            | `UPDATE users SET data = jsonb_set(data, '{email}', '"new@email.com"');` |

## Array Operations

| Operation      | Purpose                 | Example                                                   |
| -------------- | ----------------------- | --------------------------------------------------------- |
| `ANY`          | Match any array element | `SELECT * FROM users WHERE 'admin' = ANY(roles);`         |
| `@>`           | Array contains          | `SELECT * FROM users WHERE roles @> ARRAY['admin'];`      |
| `array_append` | Add to array            | `UPDATE users SET roles = array_append(roles, 'editor');` |
| `array_remove` | Remove from array       | `UPDATE users SET roles = array_remove(roles, 'guest');`  |

## Functions

| Function             | Purpose           | Example                                                                |
| -------------------- | ----------------- | ---------------------------------------------------------------------- |
| `NOW()`              | Current timestamp | `created_at TIMESTAMPTZ DEFAULT NOW()`                                 |
| `uuid_generate_v4()` | Generate UUID     | `id UUID DEFAULT uuid_generate_v4()`                                   |
| `COUNT()`            | Count rows        | `SELECT COUNT(*) FROM users;`                                          |
| `MAX()`              | Maximum value     | `SELECT MAX(age) FROM users;`                                          |
| `COALESCE()`         | First non-null    | `SELECT COALESCE(nickname, name) FROM users;`                          |
| `CASE`               | Conditional logic | `SELECT CASE WHEN age >= 18 THEN 'adult' ELSE 'minor' END FROM users;` |

## Row Level Security (RLS)

| Command                     | Purpose            | Example                                                              |
| --------------------------- | ------------------ | -------------------------------------------------------------------- |
| `ENABLE ROW LEVEL SECURITY` | Turn on RLS        | `ALTER TABLE users ENABLE ROW LEVEL SECURITY;`                       |
| `CREATE POLICY`             | Create access rule | `CREATE POLICY "own_data" ON users FOR ALL USING (id = auth.uid());` |
| `DROP POLICY`               | Remove policy      | `DROP POLICY "own_data" ON users;`                                   |

## Useful Supabase-Specific

| Function      | Purpose           | Example                               |
| ------------- | ----------------- | ------------------------------------- |
| `auth.uid()`  | Current user ID   | `WHERE user_id = auth.uid()`          |
| `auth.role()` | Current user role | `WHERE auth.role() = 'authenticated'` |

## Common Patterns

### Create table with common fields:

```sql
CREATE TABLE my_table (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Basic RLS policy:

```sql
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own data" ON my_table
FOR ALL USING (user_id = auth.uid());
```

### Search in JSONB:

```sql
SELECT * FROM users
WHERE data->>'status' = 'active'
AND data->'settings'->>'theme' = 'dark';
```
