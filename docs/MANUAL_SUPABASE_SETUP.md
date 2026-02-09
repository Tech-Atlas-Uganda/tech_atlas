# Manual Supabase Database Setup

Since there are network connectivity issues with the automated setup, let's set up the database manually through Supabase's web interface.

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

## Step 2: Run the Database Setup Script

1. Copy the entire contents of `supabase-setup.sql` file
2. Paste it into the SQL Editor
3. Click **Run** to execute the script

This will create all the necessary tables for Tech Atlas:
- ✅ Users table (with categories field)
- ✅ Hubs, Communities, Startups tables
- ✅ Jobs and Gigs tables
- ✅ Events and Opportunities tables
- ✅ Learning Resources table
- ✅ Blog Posts table
- ✅ Forum Threads and Replies tables
- ✅ All necessary ENUM types

## Step 3: Verify Tables Were Created

After running the script, you should see:
- A success message at the bottom
- All tables listed in the **Table Editor** section

## Step 4: Test the Application

1. Update your `.env` file with the correct connection string:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_PROJECT.supabase.co:5432/postgres
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Visit http://localhost:3000

## Step 5: Test Key Features

Once the server is running, test these features:

### Authentication ✅
- Sign up/Sign in should work (uses Supabase Auth)
- User profiles should be created in the database

### Content Submission ✅
- Submit a job posting
- Submit an event
- Submit a startup/hub/community
- All should be stored in the database

### Admin Panel ✅
- Sign in as admin user
- Visit `/admin` to moderate content
- Approve/reject submissions

### Forum ✅
- Create forum threads
- Reply to discussions
- Vote on content

## Troubleshooting

**If tables don't appear:**
- Check for error messages in the SQL Editor
- Make sure you copied the entire script
- Try running sections of the script separately

**If authentication doesn't work:**
- Verify Supabase Auth is enabled in your project
- Check that SUPABASE_URL and SUPABASE_ANON_KEY are correct

**If data doesn't save:**
- Check the browser console for errors
- Verify the DATABASE_URL is correct
- Make sure all tables were created successfully

## Success Indicators

✅ **Database Setup Complete** when:
- All 13 tables are visible in Supabase Table Editor
- No errors in SQL Editor
- Development server starts without database errors
- You can sign in and create content

## Next Steps

Once everything is working:
1. Create some test content (jobs, events, etc.)
2. Test the filtering systems on each page
3. Try the admin moderation features
4. Test the forum functionality

The platform should now be fully functional with Supabase as the database backend! 🚀