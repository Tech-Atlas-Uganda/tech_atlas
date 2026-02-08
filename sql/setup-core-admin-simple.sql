-- Simple Core Admin Setup for techatlasug@gmail.com
-- Run this in Supabase SQL Editor

-- Option 1: If user already exists, just update their role
UPDATE users 
SET role = 'core_admin'
WHERE email = 'techatlasug@gmail.com';

-- Option 2: If user doesn't exist, create them
-- (Uncomment the lines below if needed)

/*
INSERT INTO users (
  "openId",
  name,
  email,
  role,
  "loginMethod",
  "createdAt",
  "updatedAt",
  "lastSignedIn"
)
VALUES (
  'core-admin-techatlasug',
  'Tech Atlas Uganda',
  'techatlasug@gmail.com',
  'core_admin',
  'supabase',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT ("openId") DO UPDATE
SET role = 'core_admin';
*/

-- Verify the result
SELECT 
  id,
  email,
  name,
  role,
  "createdAt"
FROM users 
WHERE email = 'techatlasug@gmail.com';
