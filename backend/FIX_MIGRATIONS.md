# How to Fix Migration Issues

## Problem
Django thinks migrations are applied (marked with [X]), but the actual database tables don't exist. This causes errors like "Table 'railway.auth_user' doesn't exist".

## Solution Options

### Option 1: Clear Migration Records (Recommended)

If you have access to your MySQL database (via Railway dashboard or MySQL client):

1. **Connect to your MySQL database** using Railway dashboard or a MySQL client
2. **Run this SQL command:**
   ```sql
   DELETE FROM django_migrations;
   ```
   This clears all migration records.

3. **Then run migrations fresh:**
   ```bash
   python manage.py migrate
   ```

### Option 2: Use Django Management Commands

If you can connect to the database:

1. **Fake-unapply all migrations:**
   ```bash
   python manage.py migrate auth zero --fake
   python manage.py migrate admin zero --fake
   python manage.py migrate contenttypes zero --fake
   python manage.py migrate sessions zero --fake
   python manage.py migrate inventory zero --fake
   ```

2. **Then reapply all migrations:**
   ```bash
   python manage.py migrate
   ```

### Option 3: Manual SQL Fix (If you have database access)

Connect to your MySQL database and run:

```sql
-- Check what tables exist
SHOW TABLES;

-- If django_migrations table exists but is causing issues, you can:
-- Option A: Clear migration records
DELETE FROM django_migrations;

-- Option B: Drop and recreate django_migrations table
DROP TABLE IF EXISTS django_migrations;
```

Then run:
```bash
python manage.py migrate
```

### Option 4: Reset Everything (Nuclear Option)

**WARNING: This will delete all data!**

1. **Drop all tables in the database** (via Railway dashboard or MySQL client)
2. **Delete migration files** (optional, only if you want to start completely fresh):
   ```bash
   # Don't delete these, just re-run migrations
   ```
3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

## Quick Fix Script

I've created a Python script `fix_migrations.py` that you can run if you have database access:

```bash
cd backend
python fix_migrations.py
python manage.py migrate
```

## After Fixing

Once migrations are fixed:

1. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

2. **Start server:**
   ```bash
   python manage.py runserver
   ```

## Why This Happened

This usually occurs when:
- Database was reset/cleared but `django_migrations` table still exists
- Migrations were faked but never actually applied
- Database connection was lost during migration
- Manual database changes were made

## Prevention

- Always run `python manage.py migrate` after database changes
- Don't manually delete tables without clearing migration records
- Use `--fake` flag carefully and only when you know what you're doing

