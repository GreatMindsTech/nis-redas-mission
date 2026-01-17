# Quick Start - Database Migration & Seeding

## Run These Commands in Order

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Run Migrations and Seed Database
```bash
php artisan migrate:fresh --seed
```

This single command will:
- Drop all existing tables
- Create fresh tables from migrations
- Seed the database with mock users

## Alternative: Step-by-Step

If you prefer to run migrations and seeding separately:

```bash
# Step 1: Run migrations
php artisan migrate:fresh

# Step 2: Seed the database
php artisan db:seed
```

## Verify the Setup

Check if users were created successfully:

```bash
php artisan tinker
```

Then in tinker:
```php
User::all();
User::where('role', 'super_admin')->first();
exit
```

## Mock User Login Credentials

| Email | Password | Role |
|-------|----------|------|
| super_admin@example.com | password | super_admin |
| admin@example.com | password | admin |
| supervisor@example.com | password | supervisor |
| user@example.com | password | user |

## Test Login

You can now use these credentials to test your login authentication system!

---

For detailed documentation, see [DATABASE_SETUP.md](./DATABASE_SETUP.md)
