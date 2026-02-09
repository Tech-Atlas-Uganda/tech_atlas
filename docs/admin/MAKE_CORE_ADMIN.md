# 🚀 Quick: Make techatlasug@gmail.com Core Admin

## ⚠️ IMPORTANT: Run This First!

The database enum needs to include all role values. Run the complete setup script:

## Copy & Paste This Into Supabase SQL Editor:

**Use this file:** `sql/complete-role-setup.sql`

Or copy this code:

```sql
-- Add core_admin to role enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'core_admin' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'role')) THEN
        ALTER TYPE role ADD VALUE 'core_admin';
    END IF;
END $$;

-- Add contributor to role enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'contributor' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'role')) THEN
        ALTER TYPE role ADD VALUE 'contributor';
    END IF;
END $$;

-- Make techatlasug@gmail.com a Core Admin
UPDATE users 
SET role = 'core_admin'
WHERE email = 'techatlasug@gmail.com';

-- Verify
SELECT id, email, name, role FROM users WHERE email = 'techatlasug@gmail.com';
```

## Steps:
1. Open Supabase Dashboard → SQL Editor
2. Paste the code above
3. Click "Run"
4. ✅ Done!

## Test:
1. Login with `techatlasug@gmail.com`
2. Look for 👑 **Core Admin** in sidebar
3. Click to access `/core-admin`

---

## 📁 SQL Files Available:

- **`sql/complete-role-setup.sql`** - Complete setup (RECOMMENDED)
- **`sql/add-missing-roles.sql`** - Just add missing roles
- **`sql/make-core-admin.sql`** - Make user core admin (after roles added)

---

**Full Guide:** See `docs/SETUP_CORE_ADMIN.md`
