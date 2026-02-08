-- Fix Core Admin Access for techatlasug@gmail.com
-- This updates BOTH the users table AND auth.users metadata

-- ============================================
-- IMPORTANT: The frontend checks user.user_metadata.role
-- We need to update auth.users.raw_user_meta_data
-- ============================================

-- STEP 1: Update users table
UPDATE users 
SET 
    role = 'core_admin',
    "updatedAt" = NOW(),
    "roleAssignedAt" = NOW(),
    "assignedBy" = 1
WHERE email = 'techatlasug@gmail.com';

SELECT '✅ Step 1: Updated users table' as status;

-- STEP 2: Update auth.users metadata (CRITICAL!)
-- This is what the frontend actually reads!
UPDATE auth.users
SET raw_user_meta_data = 
    COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object(
        'role', 'core_admin',
        'name', COALESCE(raw_user_meta_data->>'name', 'Tech Atlas Admin')
    )
WHERE email = 'techatlasug@gmail.com';

SELECT '✅ Step 2: Updated auth.users metadata (this is what frontend reads!)' as status;

-- STEP 3: Force session refresh by updating updated_at
UPDATE auth.users
SET updated_at = NOW()
WHERE email = 'techatlasug@gmail.com';

SELECT '✅ Step 3: Triggered session refresh' as status;

-- ============================================
-- VERIFICATION
-- ============================================

SELECT '========== VERIFICATION ==========' as section;

-- Check users table
SELECT 
    '1. users table:' as check_name,
    email,
    role as users_table_role
FROM users 
WHERE email = 'techatlasug@gmail.com';

-- Check auth.users metadata (THIS IS WHAT MATTERS!)
SELECT 
    '2. auth.users metadata (FRONTEND READS THIS):' as check_name,
    email,
    raw_user_meta_data->>'role' as metadata_role,
    raw_user_meta_data->>'name' as metadata_name
FROM auth.users 
WHERE email = 'techatlasug@gmail.com';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

SELECT '========================================' as separator;
SELECT '✅ CORE ADMIN ACCESS FIXED!' as status;
SELECT '========================================' as separator;
SELECT '' as blank;
SELECT '⚠️  IMPORTANT: You MUST sign out and sign in again!' as warning;
SELECT '' as blank;
SELECT 'Steps to complete:' as instruction;
SELECT '1. Sign OUT from the platform completely' as step_1;
SELECT '2. Close all browser tabs with the platform' as step_2;
SELECT '3. Clear browser cache (optional but recommended)' as step_3;
SELECT '4. Sign IN again with techatlasug@gmail.com' as step_4;
SELECT '5. Look for 👑 Core Admin in the sidebar' as step_5;
SELECT '6. Click to access /core-admin' as step_6;
SELECT '========================================' as separator;
