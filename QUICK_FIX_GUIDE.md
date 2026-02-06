# 🚨 QUICK FIX: Opportunities Not Showing

## The Problem
Your database tables are missing the `imageUrl` and `category` columns, so opportunities can't be saved.

## The Fix (2 minutes)

### Step 1: Open Supabase SQL Editor
```
1. Go to: https://supabase.com/dashboard
2. Select your Tech Atlas project
3. Click "SQL Editor" (left sidebar)
4. Click "New query"
```

### Step 2: Copy This SQL
```sql
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS "imageUrl" varchar(500);

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS "imageUrl" varchar(500);

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS "category" varchar(100);
```

### Step 3: Run It
```
1. Paste the SQL into the editor
2. Click "Run" (or press Ctrl+Enter)
3. Wait for "Success" message
```

### Step 4: Test It
```
1. Go to: http://localhost:3003/events
2. Click "Add Event/Opportunity"
3. Select "Opportunity"
4. Fill in the form
5. Submit
6. Should now appear on the page! ✅
```

## That's It!

Your opportunities will now save and display correctly.

## Verify It Worked

Run this in SQL Editor to see your opportunities:
```sql
SELECT id, title, category, "imageUrl", status 
FROM opportunities 
ORDER BY "createdAt" DESC;
```

## Files Reference
- **SQL to run**: `RUN_THIS_SQL_NOW.sql`
- **Detailed guide**: `FIX_OPPORTUNITIES_NOT_SHOWING.md`
- **Check database**: `check-opportunities.sql`
