-- Add privacy field to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "isPublic" boolean DEFAULT false NOT NULL;

-- Add avatar field for profile pictures
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "avatar" varchar(500);

-- Verify columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('isPublic', 'avatar');
