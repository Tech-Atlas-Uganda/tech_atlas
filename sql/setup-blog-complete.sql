-- ============================================
-- COMPLETE BLOG SETUP FOR SUPABASE
-- ============================================
-- Run this entire file in Supabase SQL Editor
-- This will set up everything needed for blog functionality

-- ============================================
-- STEP 1: Ensure blog_posts table has coverImage column
-- ============================================

-- Check if coverImage column exists, add if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'blog_posts' 
        AND column_name = 'coverImage'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN "coverImage" varchar(500);
        RAISE NOTICE 'Added coverImage column to blog_posts table';
    ELSE
        RAISE NOTICE 'coverImage column already exists';
    END IF;
END $$;

-- ============================================
-- STEP 2: Verify blog_posts table structure
-- ============================================

-- This will show you all columns in the blog_posts table
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'blog_posts'
ORDER BY ordinal_position;

-- ============================================
-- STEP 3: Create blog-images storage bucket
-- ============================================

-- NOTE: You must create the bucket manually in Supabase Dashboard first!
-- Go to: Storage > New Bucket
-- Name: blog-images
-- Public: YES (checked)
-- Then run the policies below

-- ============================================
-- STEP 4: Set up storage policies for blog-images bucket
-- ============================================

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public blog image access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Allow anyone to view blog images (public read)
CREATE POLICY "Public blog image access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'blog-images' );

-- Allow authenticated users to upload blog images
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'blog-images' );

-- Allow authenticated users to update their blog images
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'blog-images' );

-- Allow authenticated users to delete their blog images
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'blog-images' );

-- ============================================
-- STEP 5: Verify storage policies were created
-- ============================================

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%blog%'
ORDER BY policyname;

-- ============================================
-- STEP 6: Test blog_posts table
-- ============================================

-- Insert a test blog post (will be deleted after)
INSERT INTO blog_posts (
    title,
    slug,
    excerpt,
    content,
    "coverImage",
    category,
    tags,
    "authorId",
    "createdBy",
    status
) VALUES (
    'Test Blog Post',
    'test-blog-post-' || floor(random() * 1000000),
    'This is a test excerpt',
    'This is test content for the blog post.',
    'https://example.com/test-image.jpg',
    'Tech Trends',
    '["test", "setup"]'::json,
    1,
    1,
    'draft'
);

-- Verify the test post was created
SELECT 
    id,
    title,
    slug,
    "coverImage",
    category,
    status,
    "createdAt"
FROM blog_posts 
WHERE title = 'Test Blog Post'
ORDER BY "createdAt" DESC
LIMIT 1;

-- Clean up test post
DELETE FROM blog_posts WHERE title = 'Test Blog Post';

-- ============================================
-- STEP 7: Summary
-- ============================================

SELECT 
    'Setup Complete!' as status,
    (SELECT COUNT(*) FROM blog_posts) as total_blog_posts,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%blog%') as blog_storage_policies;

-- ============================================
-- NEXT STEPS:
-- ============================================
-- 1. Verify blog-images bucket exists in Storage section
-- 2. Restart your dev server: pnpm dev
-- 3. Log in to your app
-- 4. Navigate to /submit-blog
-- 5. Try submitting a blog post with and without an image
-- 6. Check this table to see your posts: SELECT * FROM blog_posts;
-- 7. Check Storage > blog-images to see uploaded images
-- ============================================
