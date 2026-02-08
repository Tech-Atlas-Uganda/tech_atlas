-- Add missing columns to users table
-- Run this in Supabase SQL Editor

-- First, check what columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Add isPublic column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'isPublic'
    ) THEN
        ALTER TABLE users ADD COLUMN "isPublic" BOOLEAN DEFAULT FALSE NOT NULL;
        RAISE NOTICE 'Added isPublic column';
    ELSE
        RAISE NOTICE 'isPublic column already exists';
    END IF;
END $$;

-- Add avatar column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'avatar'
    ) THEN
        ALTER TABLE users ADD COLUMN avatar VARCHAR(500);
        RAISE NOTICE 'Added avatar column';
    ELSE
        RAISE NOTICE 'avatar column already exists';
    END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('isPublic', 'avatar');

-- Show sample of users table structure
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;
