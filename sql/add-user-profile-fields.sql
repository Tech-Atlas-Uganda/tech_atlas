-- Add profile privacy and avatar fields to users table

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "isPublic" boolean DEFAULT false NOT NULL;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "avatar" varchar(500);

-- Update existing users to have public profiles by default
UPDATE users SET "isPublic" = true WHERE "isPublic" IS NULL;

-- Verify columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users' 
AND column_name IN ('isPublic', 'avatar')
ORDER BY column_name;
