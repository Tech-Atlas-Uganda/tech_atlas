# Blog Image Upload - Complete Setup Guide

## Overview
This document explains the blog submission system with image upload functionality and automatic default image generation.

## Features Implemented

### 1. Image Upload to Supabase Storage
- Users can upload cover images for blog posts
- Images are stored in the `blog-images` bucket in Supabase Storage
- Automatic file naming: `blog-{timestamp}.{extension}`
- Supported formats: PNG, JPG, GIF (up to 5MB)

### 2. Automatic Default Image Generation
If no image is uploaded, the system automatically generates a branded default image:
- **Dimensions**: 1200x630px (optimal for social sharing)
- **Design**: Blue gradient background (#3b82f6 → #1e40af)
- **Branding**: "TECH ATLAS BLOG" text with blog title
- **Format**: PNG
- **Auto-upload**: Generated image is automatically uploaded to Supabase

### 3. Database Integration
- Blog posts are saved to `blog_posts` table via Supabase client
- Cover image URL is stored in the `coverImage` column
- Status defaults to 'pending' for review

## Setup Instructions

### Step 1: Create blog-images Bucket in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Storage** section
3. Click **New Bucket**
4. Configure:
   - **Name**: `blog-images`
   - **Public**: ✅ YES (checked)
   - **File size limit**: 5MB (recommended)
   - **Allowed MIME types**: image/png, image/jpeg, image/gif

### Step 2: Set Up Storage Policies

Run the SQL commands in `sql/setup-blog-images-bucket.sql`:

```sql
-- Allow public read access to blog images
CREATE POLICY "Public blog image access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'blog-images' );

-- Allow authenticated users to upload blog images
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'blog-images' );

-- Allow authenticated users to update blog images
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'blog-images' );

-- Allow authenticated users to delete blog images
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'blog-images' );
```

### Step 3: Verify Environment Variables

Ensure these are set in your `.env` file:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 4: Verify blog_posts Table

The table should already exist from the main setup. Verify it has these columns:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'blog_posts';
```

Expected columns:
- `id` (integer, primary key)
- `title` (varchar)
- `slug` (varchar, unique)
- `excerpt` (text)
- `content` (text)
- `coverImage` (varchar)
- `category` (varchar)
- `tags` (json)
- `authorId` (integer)
- `status` (enum: draft, pending, published, archived)
- `createdBy` (integer)
- `approvedBy` (integer)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- `approvedAt` (timestamp)
- `publishedAt` (timestamp)
- `featured` (boolean)

## How It Works

### User Flow

1. **User navigates to Submit Blog** (`/submit-blog`)
2. **Fills in blog details**:
   - Title (required)
   - Excerpt (required)
   - Content (required)
   - Category (required)
   - Tags (optional, max 10)
   - Cover Image (optional)

3. **Image handling**:
   - If user uploads image → Upload to `blog-images` bucket
   - If no image → Generate default branded image → Upload to bucket

4. **Blog post creation**:
   - Data sent to `blog.create` mutation
   - Saved to `blog_posts` table via Supabase client
   - Status set to 'pending' for admin review

5. **Success**:
   - User redirected to `/blog`
   - Success toast notification shown

### Technical Implementation

#### Frontend (`client/src/pages/SubmitBlog.tsx`)

```typescript
// Image upload handler
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setPost(prev => ({ ...prev, coverImage: file }));
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPost(prev => ({ ...prev, coverImagePreview: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  }
};

// Submit handler
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  let coverImageUrl = "";
  
  // Upload cover image if provided
  if (post.coverImage) {
    const fileExt = post.coverImage.name.split('.').pop();
    const fileName = `blog-${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(fileName, post.coverImage);
    
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);
      coverImageUrl = publicUrl;
    }
  }
  
  // Generate default image if no image provided
  if (!coverImageUrl) {
    coverImageUrl = await generateDefaultBlogImage(post.title);
  }
  
  // Create blog post
  await createBlogPost.mutateAsync({
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    tags: post.tags,
    coverImage: coverImageUrl,
  });
};
```

#### Backend (`server/routers.ts`)

```typescript
blog: router({
  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      excerpt: z.string().optional(),
      content: z.string(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      coverImage: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const slug = generateSlug(input.title);
      
      const blogData = {
        title: input.title,
        slug,
        excerpt: input.excerpt,
        content: input.content,
        category: input.category,
        tags: input.tags,
        coverImage: input.coverImage,
        authorId: ctx.user.id,
        createdBy: ctx.user.id,
        status: 'pending',
      };
      
      const result = await dbSupabase.createBlogPostSupabase(blogData);
      return result;
    }),
}),
```

#### Supabase Helper (`server/db-supabase.ts`)

```typescript
export async function createBlogPostSupabase(data: any) {
  const cleanData = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || null,
    content: data.content,
    coverImage: data.coverImage || null,
    category: data.category || null,
    tags: data.tags || null,
    authorId: data.authorId,
    createdBy: data.createdBy,
    status: data.status || 'pending',
    featured: data.featured ?? false,
    approvedBy: data.approvedBy || null,
  };

  const { data: result, error } = await supabase
    .from('blog_posts')
    .insert(cleanData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create blog post: ${error.message}`);
  }

  return result;
}
```

## Default Image Generation

The system generates a professional-looking default image using HTML5 Canvas:

```typescript
const generateDefaultBlogImage = async (title: string): Promise<string> => {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  
  // Blue gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#3b82f6'); // blue-500
  gradient.addColorStop(1, '#1e40af'); // blue-800
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add branding text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 72px Space Grotesk, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TECH ATLAS', canvas.width / 2, canvas.height / 2 - 60);
  ctx.font = 'bold 48px Space Grotesk, sans-serif';
  ctx.fillText('BLOG', canvas.width / 2, canvas.height / 2 + 20);
  
  // Add blog title
  const truncatedTitle = title.length > 50 ? title.substring(0, 47) + '...' : title;
  ctx.font = '32px Inter, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText(truncatedTitle, canvas.width / 2, canvas.height / 2 + 100);
  
  // Convert to blob and upload
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      const fileName = `default-blog-${Date.now()}.png`;
      const { data } = await supabase.storage
        .from('blog-images')
        .upload(fileName, blob, { contentType: 'image/png' });
      
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);
      
      resolve(publicUrl);
    }, 'image/png');
  });
};
```

## Troubleshooting

### Issue: "Failed to submit blog post"

**Possible causes:**
1. User not authenticated
2. blog-images bucket doesn't exist
3. Storage policies not set up
4. blog_posts table missing columns

**Solutions:**
1. Ensure user is logged in (check Supabase auth)
2. Create bucket in Supabase Dashboard
3. Run SQL from `sql/setup-blog-images-bucket.sql`
4. Verify table schema matches expected structure

### Issue: Image upload fails

**Check:**
1. Bucket is set to Public
2. File size is under 5MB
3. File type is image/png, image/jpeg, or image/gif
4. Storage policies allow authenticated uploads

### Issue: Default image not generating

**Check:**
1. Browser supports HTML5 Canvas
2. Supabase storage is accessible
3. Check browser console for errors

## Testing

### Test Image Upload
1. Log in to the app
2. Navigate to `/submit-blog`
3. Fill in required fields
4. Upload an image (PNG/JPG)
5. Submit
6. Verify image appears in Supabase Storage > blog-images

### Test Default Image Generation
1. Log in to the app
2. Navigate to `/submit-blog`
3. Fill in required fields
4. **Don't upload an image**
5. Submit
6. Verify default image was generated and uploaded to blog-images

### Test Blog Post Creation
1. Submit a blog post (with or without image)
2. Check Supabase Dashboard > Table Editor > blog_posts
3. Verify new row exists with:
   - Correct title, content, category
   - coverImage URL populated
   - status = 'pending'
   - authorId matches your user ID

## Files Modified

- `server/routers.ts` - Added blog.create mutation with Supabase integration
- `server/db-supabase.ts` - Added createBlogPostSupabase and getBlogPostsSupabase helpers
- `client/src/pages/SubmitBlog.tsx` - Implemented image upload and default generation
- `sql/setup-blog-images-bucket.sql` - Storage policies for blog images

## Next Steps

1. **Admin Review System**: Build admin interface to approve/reject pending blog posts
2. **Rich Text Editor**: Replace textarea with markdown or WYSIWYG editor
3. **Image Optimization**: Add image compression before upload
4. **Multiple Images**: Allow multiple images in blog content
5. **Draft Saving**: Auto-save drafts as user types

## Summary

The blog submission system is now fully functional with:
- ✅ Image upload to Supabase Storage
- ✅ Automatic default image generation
- ✅ Database persistence via Supabase client
- ✅ User authentication required
- ✅ Pending status for admin review
- ✅ Error handling and user feedback
