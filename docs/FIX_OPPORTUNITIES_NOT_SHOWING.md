# Fix: Opportunities Not Showing

## 🔴 Problem Identified

The `opportunities` table (and `events` table) are **missing required columns**:
- ❌ `imageUrl` column - needed to store image URLs
- ❌ `category` column (opportunities only) - needed for categorization

This is why opportunities appear to submit successfully but don't save to the database.

## ✅ Solution: Run Migration SQL

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your Tech Atlas project
3. Click **SQL Editor** in the left sidebar
4. Click **"New query"**

### Step 2: Run the Migration

Copy and paste this SQL into the editor:

```sql
-- Add missing columns to events and opportunities tables

-- ===== EVENTS TABLE =====
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS "imageUrl" varchar(500);

-- ===== OPPORTUNITIES TABLE =====
ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS "imageUrl" varchar(500);

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS "category" varchar(100);
```

### Step 3: Execute the Query

1. Click **"Run"** button (or press Ctrl+Enter)
2. Wait for success message
3. Verify columns were added

### Step 4: Verify the Fix

Run this verification query:

```sql
-- Check if columns exist
SELECT 
  table_name, 
  column_name, 
  data_type, 
  character_maximum_length 
FROM information_schema.columns 
WHERE table_name IN ('events', 'opportunities') 
AND column_name IN ('imageUrl', 'category')
ORDER BY table_name, column_name;
```

You should see:
```
events          | imageUrl | varchar | 500
opportunities   | category | varchar | 100
opportunities   | imageUrl | varchar | 500
```

## 🧪 Test the Fix

### Test Opportunity Submission

1. Go to http://localhost:3003/events
2. Click **"Add Event/Opportunity"**
3. Select **"Opportunity"**
4. Fill in the form:
   - Title: "Test Opportunity"
   - Type: "Grant"
   - Category: "Software Development"
   - Provider: "Test Provider"
   - Amount: "5000"
   - Upload an image OR leave blank for default
5. Click **"Submit Opportunity"**

### Expected Results

✅ Toast notification: "Opportunity submitted successfully!"
✅ Redirects to Events page
✅ Opportunity appears in "Opportunities" tab
✅ Image displays (uploaded or default Tech Atlas branded)

### Check Database

Run this query to see your opportunities:

```sql
SELECT 
  id,
  title,
  type,
  category,
  provider,
  amount,
  "imageUrl",
  status,
  "createdAt"
FROM opportunities
ORDER BY "createdAt" DESC
LIMIT 10;
```

## 🐛 Troubleshooting

### Still not showing after migration?

1. **Check browser console** (F12):
   - Look for error messages
   - Check for 🚀 📤 ✅ ❌ emoji logs

2. **Verify submission reached server**:
   - Check server logs in terminal
   - Should see: `🎯 Creating opportunity: [title]`

3. **Check database directly**:
   ```sql
   SELECT COUNT(*) FROM opportunities;
   SELECT * FROM opportunities ORDER BY "createdAt" DESC LIMIT 5;
   ```

4. **Verify status is 'approved'**:
   ```sql
   SELECT id, title, status FROM opportunities;
   ```
   - Status should be `approved` (not `pending`)

5. **Clear browser cache**:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear cache in browser settings

### Error: "column does not exist"

If you see errors about missing columns:
- Run the migration SQL again
- Check spelling: `imageUrl` (camelCase, not snake_case)
- Verify you're in the correct database

### Opportunities submit but don't appear

1. Check the status filter in the code
2. Verify `status = 'approved'` in database
3. Check browser console for fetch errors
4. Try clicking the Refresh button on Events page

## 📋 Quick Reference

### File with Migration SQL
`add-opportunities-columns.sql`

### File to Check Database
`check-opportunities.sql`

### Tables Affected
- `events` - Added `imageUrl` column
- `opportunities` - Added `imageUrl` and `category` columns

### Why This Happened

The original database schema files didn't include these columns, but the application code was trying to save data to them. This caused silent failures where:
- Submission appeared successful (frontend)
- But database rejected the insert (backend)
- No error shown to user

## ✨ After the Fix

Once you run the migration:
- ✅ Events with images will save properly
- ✅ Opportunities with images will save properly
- ✅ Default images will be generated and saved
- ✅ Categories will be stored correctly
- ✅ Everything will display on the Events page

## 🎉 Success Indicators

You'll know it's working when:
1. Opportunity submission shows success toast
2. Redirects to Events page
3. Opportunity appears in "Opportunities" tab
4. Image displays correctly
5. Can see data in database with SQL query
6. Refresh button works and shows the opportunity

## 📞 Still Having Issues?

If opportunities still don't show after running the migration:
1. Share the browser console logs (F12 → Console tab)
2. Share the server terminal output
3. Share the result of this SQL query:
   ```sql
   SELECT * FROM opportunities ORDER BY "createdAt" DESC LIMIT 3;
   ```
