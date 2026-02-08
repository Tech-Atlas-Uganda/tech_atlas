-- Debug: Check User Role and Auth Setup
-- Run this in Supabase SQL Editor to diagnose the issue

-- ============================================
-- STEP 1: Check if user exists and their role
-- ============================================

SELECT '========== USER DATA ==========' as section;

SELECT 
    id,
    "openId",
    email,
    name,
    role,
    "createdAt",
    "updatedAt",
    "roleAssignedAt",
    "assignedBy"
FROM users 
WHERE email = 'techatlasug@gmail.com';

-- ============================================
-- STEP 2: Check Supabase Auth user
-- ============================================

SELECT '========== SUPABASE AUTH ==========' as section;

-- Check if user exists in auth.users
SELECT 
    id,
    email,
    raw_user_meta_data,
    created_at,
    last_sign_in_at
FROM auth.users 
WHERE email = 'techatlasug@gmail.com';

-- ============================================
-- STEP 3: Check available roles in enum
-- ============================================

SELECT '========== AVAILABLE ROLES ==========' as section;

SELECT 
    enumlabel as role,
    enumsortorder as order
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'role')
ORDER BY enumsortorder;

-- ============================================
-- STEP 4: Check if role metadata is in user_metadata
-- ============================================

SELECT '========== USER METADATA ==========' as section;

SELECT 
    email,
    raw_user_meta_data->>'role' as metadata_role,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'techatlasug@gmail.com';

-- ============================================
-- STEP 5: Diagnosis
-- ============================================

SELECT '========== DIAGNOSIS ==========' as section;

SELECT 
    CASE 
        WHEN NOT EXISTS (SELECT 1 FROM users WHERE email = 'techatlasug@gmail.com') 
        THEN '❌ User does not exist in users table'
        WHEN NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'techatlasug@gmail.com')
        THEN '❌ User does not exist in auth.users table'
        WHEN (SELECT role FROM users WHERE email = 'techatlasug@gmail.com') != 'core_admin'
        THEN '❌ User role in users table is NOT core_admin: ' || (SELECT role FROM users WHERE email = 'techatlasug@gmail.com')
        WHEN (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE email = 'techatlasug@gmail.com') IS NULL
        THEN '⚠️  User metadata does not have role field - this might be the issue!'
        WHEN (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE email = 'techatlasug@gmail.com') != 'core_admin'
        THEN '❌ User metadata role is NOT core_admin: ' || (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE email = 'techatlasug@gmail.com')
        ELSE '✅ Everything looks correct - role is set properly'
    END as diagnosis;

-- ============================================
-- STEP 6: Recommended Fix
-- ============================================

SELECT '========== RECOMMENDED FIX ==========' as section;

SELECT 
    'Run the following commands to fix the issue:' as instruction;

-- Show the fix commands
SELECT '
-- Fix 1: Update users table
UPDATE users 
SET role = ''core_admin'', "updatedAt" = NOW()
WHERE email = ''techatlasug@gmail.com'';

-- Fix 2: Update auth.users metadata
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || ''{"role": "core_admin"}''::jsonb
WHERE email = ''techatlasug@gmail.com'';

-- Fix 3: Verify
SELECT email, role FROM users WHERE email = ''techatlasug@gmail.com'';
SELECT email, raw_user_meta_data->>''role'' as role FROM auth.users WHERE email = ''techatlasug@gmail.com'';
' as fix_commands;
