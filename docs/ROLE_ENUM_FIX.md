# Fix: Role Enum Error

## ❌ Error You're Seeing:

```
ERROR: 22P02: invalid input value for enum role: "core_admin"
LINE 3: SET role = 'core_admin'
```

## 🔍 What This Means:

The PostgreSQL `role` enum type in your database doesn't include `core_admin` or `contributor` values yet. The enum was created with only the basic roles: `user`, `admin`, `moderator`, `editor`.

---

## ✅ Solution: Add Missing Roles to Enum

### Option 1: Complete Setup (RECOMMENDED)

Run the complete setup script that does everything:

**File:** `sql/complete-role-setup.sql`

This script will:
1. ✅ Add missing role values to enum
2. ✅ Create role hierarchy table
3. ✅ Create audit log tables
4. ✅ Add role metadata columns
5. ✅ Make techatlasug@gmail.com core admin
6. ✅ Verify everything

**Just run this one file and you're done!**

---

### Option 2: Quick Fix (Just Add Roles)

If you just want to add the missing roles:

```sql
-- Add core_admin to role enum
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'core_admin' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'role')
    ) THEN
        ALTER TYPE role ADD VALUE 'core_admin';
        RAISE NOTICE '✅ Added core_admin role';
    END IF;
END $$;

-- Add contributor to role enum
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'contributor' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'role')
    ) THEN
        ALTER TYPE role ADD VALUE 'contributor';
        RAISE NOTICE '✅ Added contributor role';
    END IF;
END $$;

-- Verify
SELECT enumlabel as available_roles 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'role')
ORDER BY enumsortorder;
```

Then run:

```sql
-- Now you can assign core_admin
UPDATE users 
SET role = 'core_admin'
WHERE email = 'techatlasug@gmail.com';

-- Verify
SELECT id, email, name, role FROM users WHERE email = 'techatlasug@gmail.com';
```

---

## 🔍 Understanding PostgreSQL Enums

### What is an Enum?

An enum (enumerated type) is a data type that consists of a static, ordered set of values.

In your database, the `role` enum was created like this:

```sql
CREATE TYPE "role" AS ENUM ('user', 'admin', 'moderator', 'editor');
```

### Why Can't We Just Add Values?

PostgreSQL enums are strict - you can only use values that are defined in the enum. To add new values, you must use `ALTER TYPE ... ADD VALUE`.

### Current Roles vs. Needed Roles:

**Currently in Database:**
- `user`
- `admin`
- `moderator`
- `editor`

**Missing (Need to Add):**
- `contributor` ← NEW
- `core_admin` ← NEW

---

## 📋 Step-by-Step Fix

### Step 1: Check Current Roles

```sql
-- See what roles are currently available
SELECT enumlabel as role, enumsortorder as order
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'role')
ORDER BY enumsortorder;
```

**Expected Output:**
```
role      | order
----------|------
user      | 1
admin     | 2
moderator | 3
editor    | 4
```

### Step 2: Add Missing Roles

```sql
-- Add contributor
ALTER TYPE role ADD VALUE IF NOT EXISTS 'contributor';

-- Add core_admin
ALTER TYPE role ADD VALUE IF NOT EXISTS 'core_admin';
```

**Note:** PostgreSQL 12+ supports `IF NOT EXISTS`. For older versions, use the DO block method shown above.

### Step 3: Verify Roles Added

```sql
-- Check again
SELECT enumlabel as role, enumsortorder as order
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'role')
ORDER BY enumsortorder;
```

**Expected Output:**
```
role       | order
-----------|------
user       | 1
admin      | 2
moderator  | 3
editor     | 4
contributor| 5
core_admin | 6
```

### Step 4: Assign Core Admin Role

```sql
-- Now this will work!
UPDATE users 
SET role = 'core_admin'
WHERE email = 'techatlasug@gmail.com';
```

---

## 🚨 Common Issues

### Issue 1: "Cannot add enum value in transaction"

**Error:**
```
ERROR: ALTER TYPE ... ADD VALUE cannot run inside a transaction block
```

**Solution:** 
Run the ALTER TYPE commands outside of a transaction, or use the DO block method which handles this automatically.

### Issue 2: "Role already exists"

**Error:**
```
ERROR: enum label "core_admin" already exists
```

**Solution:** 
The role is already added! Just proceed to assign it to the user.

### Issue 3: "Permission denied"

**Error:**
```
ERROR: must be owner of type role
```

**Solution:** 
You need database admin/owner permissions. Make sure you're logged into Supabase as the project owner.

---

## 🧪 Testing

After adding the roles, test that everything works:

### Test 1: Check Enum Values
```sql
SELECT enumlabel FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'role');
```

Should show all 6 roles.

### Test 2: Assign Role
```sql
UPDATE users SET role = 'core_admin' WHERE email = 'techatlasug@gmail.com';
```

Should succeed without errors.

### Test 3: Verify Assignment
```sql
SELECT email, role FROM users WHERE email = 'techatlasug@gmail.com';
```

Should show `core_admin`.

---

## 📁 Files to Use

1. **`sql/complete-role-setup.sql`** - Complete setup (RECOMMENDED)
   - Does everything in one go
   - Creates all tables
   - Adds all roles
   - Makes user core admin

2. **`sql/add-missing-roles.sql`** - Just add roles
   - Only adds missing enum values
   - Doesn't modify tables

3. **`sql/make-core-admin.sql`** - Assign core admin
   - Use AFTER adding roles
   - Assigns role to user

---

## ✅ Success Checklist

- [ ] Enum includes `contributor` value
- [ ] Enum includes `core_admin` value
- [ ] User role updated to `core_admin`
- [ ] No errors when querying user
- [ ] User can login and see Core Admin link
- [ ] `/core-admin` dashboard is accessible

---

## 🆘 Still Having Issues?

### Check Database Version:
```sql
SELECT version();
```

PostgreSQL 12+ is recommended.

### Check Your Permissions:
```sql
SELECT current_user, session_user;
```

You should be the database owner or have superuser privileges.

### Check Table Owner:
```sql
SELECT tableowner FROM pg_tables WHERE tablename = 'users';
```

---

## 📞 Need More Help?

1. Check the complete setup script: `sql/complete-role-setup.sql`
2. Review governance docs: `docs/GOVERNANCE_SYSTEM_COMPLETE.md`
3. See setup guide: `docs/SETUP_CORE_ADMIN.md`

---

**Once the enum is fixed, you'll be able to assign any role without errors!** ✅

---

*Last Updated: February 2026*  
*Issue: PostgreSQL Enum Missing Values*
