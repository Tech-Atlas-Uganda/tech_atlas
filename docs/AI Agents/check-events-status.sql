-- Check all events and their status
-- Run this in Supabase SQL Editor to see all events

SELECT 
  id,
  title,
  status,
  "startDate",
  "createdAt"
FROM events
ORDER BY "createdAt" DESC;

-- Count by status
SELECT 
  status,
  COUNT(*) as count
FROM events
GROUP BY status;

-- Check if there are any events without approved status
SELECT 
  id,
  title,
  status
FROM events
WHERE status != 'approved' OR status IS NULL;
