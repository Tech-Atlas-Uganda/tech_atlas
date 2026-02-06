-- Add missing columns to events and opportunities tables

-- ===== EVENTS TABLE =====
-- Add imageUrl column (for storing image URLs from Supabase Storage)
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS "imageUrl" varchar(500);

-- ===== OPPORTUNITIES TABLE =====
-- Add imageUrl column (for storing image URLs from Supabase Storage)
ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS "imageUrl" varchar(500);

-- Add category column (for categorizing opportunities)
ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS "category" varchar(100);

-- ===== VERIFICATION =====
-- Verify events table columns
SELECT 'EVENTS TABLE' as table_name, column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'events' 
AND column_name IN ('imageUrl', 'category')
UNION ALL
-- Verify opportunities table columns
SELECT 'OPPORTUNITIES TABLE' as table_name, column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'opportunities' 
AND column_name IN ('imageUrl', 'category')
ORDER BY table_name, column_name;

-- Show sample data to confirm
SELECT 'Events count' as info, COUNT(*)::text as value FROM events
UNION ALL
SELECT 'Opportunities count' as info, COUNT(*)::text as value FROM opportunities;

