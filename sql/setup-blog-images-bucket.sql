-- Setup blog-images bucket in Supabase
-- Run this in Supabase SQL Editor

-- Note: Buckets must be created via the Supabase Dashboard UI
-- This file documents the required policies

-- After creating the 'blog-images' bucket in Dashboard (Storage > New Bucket):
-- Name: blog-images
-- Public: YES (checked)

-- Then run these policies:

-- Allow public read access to all blog images
CREATE POLICY "Public blog image access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'blog-images' );

-- Allow authenticated users to upload blog images
CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'blog-images' );

-- Allow authenticated users to update blog images
CREATE POLICY "Authenticated users can update blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'blog-images' );

-- Allow authenticated users to delete blog images
CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'blog-images' );

-- Verify policies were created
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%blog%';
