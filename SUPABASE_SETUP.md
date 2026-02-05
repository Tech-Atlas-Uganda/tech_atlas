# Supabase Database Setup for Tech Atlas

## Quick Setup Guide

Since you already have Supabase configured for authentication, let's use Supabase's PostgreSQL database for all data storage.

### Step 1: Get Your Supabase Database URL

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **Settings** → **Database**
3. Copy the **Connection string** (URI format)
4. It should look like: `postgresql://postgres:[YOUR-PASSWORD]@db.opjxkfzofuqzijkvinzd.supabase.co:5432/postgres`

### Step 2: Update Your .env File

Replace the DATABASE_URL in your `.env` file:

```env
# Replace this line:
DATABASE_URL=mysql://user:password@localhost:3306/techatlas

# With your Supabase connection string:
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.opjxkfzofuqzijkvinzd.supabase.co:5432/postgres
```

**Important**: Replace `[YOUR-PASSWORD]` with your actual Supabase database password.

### Step 3: Update Schema Configuration

Update the drizzle config to use the PostgreSQL schema:

```bash
# Update drizzle.config.ts to point to the PostgreSQL schema
```

### Step 4: Create Tables

Run the following commands to create all the necessary tables:

```bash
# Generate migration files
pnpm db:generate

# Apply migrations to Supabase
pnpm db:push
```

### Step 5: Test the Connection

```bash
# Test database connection
pnpm db:setup

# Start the development server
pnpm dev
```

## Alternative: Keep Using MySQL

If you prefer to use MySQL locally:

1. Install XAMPP or MySQL Server
2. Create a database called `techatlas`
3. Update DATABASE_URL to: `mysql://root:@localhost:3306/techatlas`
4. Run `pnpm db:push`

## Benefits of Using Supabase Database

✅ **No local setup required** - Everything runs in the cloud
✅ **Same provider** - Authentication and database in one place
✅ **Automatic backups** - Supabase handles backups
✅ **Scalable** - Grows with your application
✅ **Free tier** - Generous limits for development

## Next Steps

Once the database is set up:

1. The platform will automatically create all necessary tables
2. User authentication will sync with the database
3. All features (jobs, events, forum, etc.) will work properly
4. You can view/manage data through Supabase dashboard

## Troubleshooting

**Connection Error**: Make sure your Supabase password is correct in the DATABASE_URL
**Permission Error**: Ensure your Supabase project is active and not paused
**Schema Error**: Run `pnpm db:push` to create missing tables

Choose Supabase for the easiest setup! 🚀