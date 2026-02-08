-- Add Missing Roles to Database Enum
-- Run this in Supabase SQL Editor FIRST before assigning roles

-- Step 1: Check current role enum values
SELECT 
    e.enumlabel as role_value,
    e.enumsortorder as sort_order
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'role'
ORDER BY e.enumsortorder;

-- Step 2: Add missing role values to the enum
-- Note: PostgreSQL doesn't allow adding enum values in a transaction, so we do them one by one

-- Add 'contributor' if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'contributor' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'role')) THEN
        ALTER TYPE role ADD VALUE 'contributor';
        RAISE NOTICE 'Added contributor role';
    ELSE
        RAISE NOTICE 'contributor role already exists';
    END IF;
END $$;

-- Add 'core_admin' if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'core_admin' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'role')) THEN
        ALTER TYPE role ADD VALUE 'core_admin';
        RAISE NOTICE 'Added core_admin role';
    ELSE
        RAISE NOTICE 'core_admin role already exists';
    END IF;
END $$;

-- Step 3: Verify all roles are now available
SELECT 
    e.enumlabel as role_value,
    e.enumsortorder as sort_order
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'role'
ORDER BY e.enumsortorder;

-- Expected output should include:
-- user
-- admin
-- moderator
-- editor
-- contributor (newly added)
-- core_admin (newly added)

-- Step 4: Success message
SELECT '✅ SUCCESS: All role values have been added to the enum!' as message;
SELECT 'You can now assign core_admin role to users.' as next_step;
