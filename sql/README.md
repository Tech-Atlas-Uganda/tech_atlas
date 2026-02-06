# 🗄️ SQL Scripts

This folder contains all SQL migration scripts and database setup files for Tech Atlas.

## 📋 Database Setup Scripts

### Initial Setup
- **`supabase-setup.sql`** - Complete Supabase database setup
- **`supabase-setup-fixed.sql`** - Fixed version of setup script
- **`supabase-setup-safe.sql`** - Safe setup script (no data loss)
- **`supabase-minimal-setup.sql`** - Minimal setup for quick start

### Governance & Roles
- **`governance-roles-setup.sql`** - Setup governance roles and permissions
- **`grant-admin-access.sql`** - Grant admin access to users

## 🔧 Migration Scripts

### Profile System
- **`add-user-profile-fields.sql`** - Add profile fields to users table
- **`add-profile-privacy.sql`** - Add privacy settings (isPublic, avatar)

### Opportunities & Events
- **`add-opportunities-columns.sql`** - Add imageUrl and category to opportunities
- **`fix-events-table.sql`** - Fix events table structure

### Storage
- **`check-avatar-bucket.sql`** - Setup and verify avatars storage bucket

## 🐛 Debug & Testing Scripts

- **`debug-events-table.sql`** - Debug events table issues
- **`check-opportunities.sql`** - Check opportunities table data

## 🚀 Quick Start Scripts

- **`RUN_THIS_SQL_NOW.sql`** - Critical fixes to run immediately

## 📝 Usage

### Running Scripts in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the script content
5. Click **Run** or press `Ctrl+Enter`

### Running Scripts Locally

```bash
# Using psql
psql -U username -d database_name -f sql/script-name.sql

# Using Drizzle
pnpm db:push
```

## ⚠️ Important Notes

- **Always backup your database** before running migration scripts
- **Test in development** before running in production
- **Read the script** before executing to understand what it does
- **Check dependencies** - some scripts depend on others

## 🔄 Migration Order

For a fresh setup, run scripts in this order:

1. `supabase-setup.sql` or `supabase-minimal-setup.sql`
2. `governance-roles-setup.sql`
3. `add-user-profile-fields.sql`
4. `add-profile-privacy.sql`
5. `add-opportunities-columns.sql`
6. `check-avatar-bucket.sql`
7. `fix-events-table.sql`

## 📞 Need Help?

If you encounter issues with any SQL script:

- 📧 Email: ronlinx6@gmail.com
- 📖 Check: [../docs/QUICK_DATABASE_SETUP.md](../docs/QUICK_DATABASE_SETUP.md)
- 🌐 Live Demo: [aifestug.com](https://aifestug.com)

---

**Last Updated:** December 2024
