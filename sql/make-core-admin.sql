-- Make techatlasug@gmail.com a Core Admin
-- Run this in Supabase SQL Editor

-- First, check if the user exists
SELECT id, email, name, role 
FROM users 
WHERE email = 'techatlasug@gmail.com';

-- Update the user to Core Admin role
UPDATE users 
SET 
  role = 'core_admin',
  "roleAssignedAt" = NOW(),
  "assignedBy" = 1,  -- System assignment
  "updatedAt" = NOW()
WHERE email = 'techatlasug@gmail.com';

-- Verify the update
SELECT id, email, name, role, "roleAssignedAt"
FROM users 
WHERE email = 'techatlasug@gmail.com';

-- Log the role change in audit log (if table exists)
DO $$
DECLARE
  v_user_id INTEGER;
  v_previous_role TEXT;
BEGIN
  -- Get user ID and previous role
  SELECT id, role INTO v_user_id, v_previous_role
  FROM users 
  WHERE email = 'techatlasug@gmail.com';
  
  -- Try to insert into audit log
  BEGIN
    INSERT INTO role_audit_log (
      "userId", 
      "previousRole", 
      "newRole", 
      "assignedBy", 
      reason, 
      "createdAt"
    )
    VALUES (
      v_user_id,
      v_previous_role,
      'core_admin',
      1,  -- System
      'Initial Core Admin setup',
      NOW()
    );
    
    RAISE NOTICE 'Audit log entry created successfully';
  EXCEPTION
    WHEN undefined_table THEN
      RAISE NOTICE 'Audit log table does not exist yet - skipping';
    WHEN OTHERS THEN
      RAISE NOTICE 'Could not create audit log entry: %', SQLERRM;
  END;
END $$;

-- Success message
SELECT 
  '✅ SUCCESS: techatlasug@gmail.com is now a Core Admin!' as message,
  id,
  email,
  name,
  role,
  "roleAssignedAt"
FROM users 
WHERE email = 'techatlasug@gmail.com';
