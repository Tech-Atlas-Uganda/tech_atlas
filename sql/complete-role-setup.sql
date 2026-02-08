-- Complete Role Setup for Tech Atlas
-- Run this ONCE in Supabase SQL Editor to set up all roles

-- ============================================
-- STEP 1: Add Missing Role Values to Enum
-- ============================================

-- Check what roles currently exist
SELECT 'Current roles in database:' as info;
SELECT enumlabel as role FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'role') ORDER BY enumsortorder;

-- Add 'contributor' role
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'contributor' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'role')) THEN
        ALTER TYPE role ADD VALUE 'contributor';
        RAISE NOTICE '✅ Added contributor role';
    ELSE
        RAISE NOTICE 'ℹ️  contributor role already exists';
    END IF;
END $$;

-- Add 'core_admin' role
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'core_admin' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'role')) THEN
        ALTER TYPE role ADD VALUE 'core_admin';
        RAISE NOTICE '✅ Added core_admin role';
    ELSE
        RAISE NOTICE 'ℹ️  core_admin role already exists';
    END IF;
END $$;

-- Verify all roles
SELECT 'All available roles after update:' as info;
SELECT enumlabel as role FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'role') ORDER BY enumsortorder;

-- ============================================
-- STEP 2: Create Role Hierarchy Table (if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS role_hierarchy (
    "roleName" TEXT PRIMARY KEY,
    "displayName" TEXT NOT NULL,
    description TEXT,
    level INTEGER NOT NULL,
    permissions JSONB,
    "canAssignRoles" TEXT[]
);

-- Insert role hierarchy data
INSERT INTO role_hierarchy ("roleName", "displayName", description, level, permissions, "canAssignRoles")
VALUES 
    ('user', 'Community Member', 'Basic platform access', 1, '{"view": true, "submit": true}'::jsonb, ARRAY[]::TEXT[]),
    ('contributor', 'Content Contributor', 'Trusted content submission', 2, '{"view": true, "submit": true, "fastTrack": true}'::jsonb, ARRAY[]::TEXT[]),
    ('moderator', 'Content Moderator', 'Content moderation and community management', 3, '{"view": true, "submit": true, "moderate": true, "manageForum": true}'::jsonb, ARRAY['user', 'contributor']::TEXT[]),
    ('editor', 'Content Editor', 'Content quality management', 4, '{"view": true, "submit": true, "moderate": true, "edit": true, "feature": true}'::jsonb, ARRAY['user', 'contributor', 'moderator']::TEXT[]),
    ('admin', 'Platform Administrator', 'Full platform administration', 5, '{"view": true, "submit": true, "moderate": true, "edit": true, "manageUsers": true, "analytics": true}'::jsonb, ARRAY['user', 'contributor', 'moderator', 'editor']::TEXT[]),
    ('core_admin', 'Core Administrator', 'Ultimate platform control', 6, '{"all": true}'::jsonb, ARRAY['user', 'contributor', 'moderator', 'editor', 'admin', 'core_admin']::TEXT[])
ON CONFLICT ("roleName") DO UPDATE SET
    "displayName" = EXCLUDED."displayName",
    description = EXCLUDED.description,
    level = EXCLUDED.level,
    permissions = EXCLUDED.permissions,
    "canAssignRoles" = EXCLUDED."canAssignRoles";

SELECT '✅ Role hierarchy table created/updated' as status;

-- ============================================
-- STEP 3: Create Role Audit Log Table (if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS role_audit_log (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "previousRole" TEXT,
    "newRole" TEXT NOT NULL,
    "assignedBy" INTEGER NOT NULL,
    reason TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

SELECT '✅ Role audit log table created' as status;

-- ============================================
-- STEP 4: Create Moderation Log Table (if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS moderation_log (
    id SERIAL PRIMARY KEY,
    "moderatorId" INTEGER NOT NULL,
    action TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" INTEGER NOT NULL,
    reason TEXT,
    metadata JSONB,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

SELECT '✅ Moderation log table created' as status;

-- ============================================
-- STEP 5: Add Role Metadata Columns to Users (if not exists)
-- ============================================

-- Add roleAssignedAt column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'roleAssignedAt') THEN
        ALTER TABLE users ADD COLUMN "roleAssignedAt" TIMESTAMP;
        RAISE NOTICE '✅ Added roleAssignedAt column';
    ELSE
        RAISE NOTICE 'ℹ️  roleAssignedAt column already exists';
    END IF;
END $$;

-- Add assignedBy column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'assignedBy') THEN
        ALTER TABLE users ADD COLUMN "assignedBy" INTEGER;
        RAISE NOTICE '✅ Added assignedBy column';
    ELSE
        RAISE NOTICE 'ℹ️  assignedBy column already exists';
    END IF;
END $$;

-- Add isActive column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'isActive') THEN
        ALTER TABLE users ADD COLUMN "isActive" BOOLEAN DEFAULT TRUE;
        RAISE NOTICE '✅ Added isActive column';
    ELSE
        RAISE NOTICE 'ℹ️  isActive column already exists';
    END IF;
END $$;

-- ============================================
-- STEP 6: Make techatlasug@gmail.com Core Admin
-- ============================================

-- Update the user to core_admin
UPDATE users 
SET 
    role = 'core_admin',
    "roleAssignedAt" = NOW(),
    "assignedBy" = 1,
    "updatedAt" = NOW()
WHERE email = 'techatlasug@gmail.com';

-- Log the role change
INSERT INTO role_audit_log ("userId", "previousRole", "newRole", "assignedBy", reason, "createdAt")
SELECT 
    id,
    'user',  -- Assuming previous role was user
    'core_admin',
    1,  -- System
    'Initial Core Admin setup',
    NOW()
FROM users 
WHERE email = 'techatlasug@gmail.com'
ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 7: Verify Everything
-- ============================================

SELECT '========================================' as separator;
SELECT '✅ SETUP COMPLETE!' as status;
SELECT '========================================' as separator;

-- Show all available roles
SELECT 'Available Roles:' as info;
SELECT 
    "roleName",
    "displayName",
    level,
    "canAssignRoles"
FROM role_hierarchy
ORDER BY level;

-- Show the core admin user
SELECT 'Core Admin User:' as info;
SELECT 
    id,
    email,
    name,
    role,
    "roleAssignedAt",
    "isActive"
FROM users 
WHERE email = 'techatlasug@gmail.com';

-- Show recent audit log
SELECT 'Recent Role Changes:' as info;
SELECT 
    "userId",
    "previousRole",
    "newRole",
    "assignedBy",
    reason,
    "createdAt"
FROM role_audit_log
ORDER BY "createdAt" DESC
LIMIT 5;

SELECT '========================================' as separator;
SELECT '🎉 You can now login as techatlasug@gmail.com and access /core-admin' as next_step;
SELECT '========================================' as separator;
