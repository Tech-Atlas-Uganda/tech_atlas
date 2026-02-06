-- ⚠️ RUN THIS IN SUPABASE SQL EDITOR NOW ⚠️
-- This fixes the "opportunities not showing" issue

-- Add missing imageUrl column to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS "imageUrl" varchar(500);

-- Add missing imageUrl column to opportunities table
ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS "imageUrl" varchar(500);

-- Add missing category column to opportunities table
ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS "category" varchar(100);

-- ✅ Done! Now test by submitting an opportunity.
