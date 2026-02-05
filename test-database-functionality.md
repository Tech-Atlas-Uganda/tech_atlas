# Database Functionality Test Guide

## 🎯 Complete Testing Checklist

Your server is running on **http://localhost:3001**

### ✅ Step 1: Database Setup
1. **Run the SQL script** in Supabase SQL Editor:
   - Copy contents of `supabase-setup-fixed.sql`
   - Paste and run in Supabase dashboard
   - Verify success message appears

### ✅ Step 2: Authentication Testing
1. **Sign Up**: Create account with udatalabs@gmail.com
2. **Sign In**: Test login functionality
3. **Admin Access**: Visit `/admin` to verify admin panel access

### ✅ Step 3: Events & Opportunities Testing
**Fixed Issues:**
- ✅ Router now accepts `meetingUrl` and `registrationUrl` instead of `url`
- ✅ Form sends correct field names to database
- ✅ Virtual events use `meetingUrl`, physical events use `registrationUrl`

**Test Steps:**
1. **Submit Event**: Go to `/events` → Click "Add Event" → Fill form → Submit
2. **Submit Opportunity**: Go to `/events` → Click "Add Opportunity" → Fill form → Submit
3. **Verify Storage**: Check Supabase Table Editor for new entries
4. **Test Filtering**: Use filters on events page

### ✅ Step 4: Jobs & Gigs Testing
**Fixed Issues:**
- ✅ Removed invalid fields (`category`, `companyWebsite`, `latitude`, `longitude`, `submitterName`)
- ✅ Router now matches database schema exactly

**Test Steps:**
1. **Submit Job**: Go to `/jobs` → Click "Post Job" → Fill form → Submit
2. **Submit Gig**: Go to `/jobs` → Click "Post Gig" → Fill form → Submit
3. **Test Expiration**: Set expiration dates and verify filtering
4. **Test Location Filter**: Use location and remote filters

### ✅ Step 5: Ecosystem Testing
**Test Steps:**
1. **Submit Hub**: Go to `/ecosystem` → "Add Your Organization" → Choose Hub → Submit
2. **Submit Community**: Choose Community → Fill form → Submit
3. **Submit Startup**: Choose Startup → Fill form → Submit
4. **Test Map View**: Switch to map view and verify markers appear

### ✅ Step 6: User Profiles Testing
**Fixed Issues:**
- ✅ Added categories field support
- ✅ Categories filtering works with CORE_CATEGORIES

**Test Steps:**
1. **Update Profile**: Go to `/profile/settings` → Add categories, skills, bio → Save
2. **Test Directory**: Go to `/profiles` → Use category filters → Verify filtering works
3. **Test Profile Display**: Click on user profiles to view details

### ✅ Step 7: Forum Testing
**Test Steps:**
1. **Create Thread**: Go to `/forum` → "New Thread" → Fill form → Submit
2. **Reply to Thread**: Click on thread → Add reply → Submit
3. **Vote on Content**: Test upvote/downvote functionality
4. **Test Categories**: Create threads in different categories

### ✅ Step 8: Learning Resources Testing
**Test Steps:**
1. **Submit Resource**: Go to `/learning` → "Submit Resource" → Fill form → Submit
2. **Test Filtering**: Use category, level, and type filters
3. **Verify Storage**: Check database for new entries

### ✅ Step 9: Blog Testing
**Test Steps:**
1. **Create Post**: Go to `/blog` → "Write Post" → Fill form → Submit
2. **Test Categories**: Use different blog categories
3. **Test Publishing**: Admin can approve/publish posts

### ✅ Step 10: Admin Panel Testing
**Admin Features to Test:**
1. **Content Moderation**: Approve/reject submissions
2. **User Management**: View all users and roles
3. **Analytics**: View platform statistics
4. **Bulk Actions**: Manage multiple items

## 🚨 Common Issues & Solutions

### Database Connection Issues
- **Error**: "Database not available"
- **Solution**: Verify DATABASE_URL in .env is correct
- **Check**: Supabase project is active and not paused

### Schema Mismatch Issues
- **Error**: "column does not exist"
- **Solution**: Run the complete SQL setup script
- **Verify**: All 13 tables exist in Supabase Table Editor

### Authentication Issues
- **Error**: "User not found"
- **Solution**: Sign up first, then run admin grant script
- **Check**: SUPABASE_URL and SUPABASE_ANON_KEY are correct

### Form Submission Issues
- **Error**: "Failed to submit"
- **Solution**: Check browser console for specific errors
- **Verify**: All required fields are filled

## 🎉 Success Indicators

✅ **All Systems Working** when:
- Events and opportunities submit successfully
- Jobs and gigs are stored in database
- User profiles save with categories
- Forum threads and replies work
- Admin panel shows all content
- Filtering works on all pages
- No console errors during submissions

## 📊 Database Tables to Verify

After testing, check these tables in Supabase:
1. **users** - User profiles with categories
2. **events** - Events with proper URLs
3. **opportunities** - Opportunities with applicationUrl
4. **jobs** - Job listings with expiration
5. **gigs** - Gig listings
6. **hubs** - Tech hubs
7. **communities** - Communities
8. **startups** - Startup listings
9. **forum_threads** - Forum discussions
10. **forum_replies** - Thread replies
11. **learning_resources** - Learning materials
12. **blog_posts** - Blog articles
13. **forum_votes** - Voting data

The platform should now be fully functional with all database operations working correctly! 🚀