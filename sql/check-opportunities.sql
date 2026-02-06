-- Check if opportunities table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'opportunities'
);

-- Check opportunities table structure
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'opportunities'
ORDER BY ordinal_position;

-- Count all opportunities
SELECT COUNT(*) as total_opportunities FROM opportunities;

-- Show all opportunities (limit 10)
SELECT 
  id,
  title,
  type,
  status,
  "imageUrl",
  "createdAt",
  "createdBy"
FROM opportunities
ORDER BY "createdAt" DESC
LIMIT 10;

-- Check for opportunities with status 'approved'
SELECT COUNT(*) as approved_opportunities 
FROM opportunities 
WHERE status = 'approved';

-- Show recent opportunities with all details
SELECT * FROM opportunities 
ORDER BY "createdAt" DESC 
LIMIT 5;
