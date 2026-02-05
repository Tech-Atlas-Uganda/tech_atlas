-- Grant Admin Access to udatalabs@gmail.com
-- Run this script in Supabase SQL Editor after the user has signed up

-- Update existing user to admin if they exist
UPDATE users 
SET role = 'admin' 
WHERE email = 'udatalabs@gmail.com';

-- Insert admin user if they don't exist yet
INSERT INTO users ("openId", name, email, role, "loginMethod", "createdAt", "updatedAt", "lastSignedIn")
VALUES ('udatalabs-admin', 'UData Labs Admin', 'udatalabs@gmail.com', 'admin', 'supabase', NOW(), NOW(), NOW())
ON CONFLICT ("openId") DO NOTHING;

-- Verify admin access was granted
SELECT id, name, email, role, "createdAt" 
FROM users 
WHERE email = 'udatalabs@gmail.com' OR role = 'admin';

-- Success message
SELECT 'Admin access granted to udatalabs@gmail.com' as message;