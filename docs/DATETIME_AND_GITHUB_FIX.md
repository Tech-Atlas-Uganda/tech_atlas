# DateTime & GitHub Stats Fix

## ✅ What Was Fixed

### 1. **GitHub Stats - Tech Atlas Uganda Repo** 🐙
- Changed from generic Uganda tech repos search
- Now fetches from: `Tech-Atlas-Uganda/tech_atlas`
- Direct repo API call instead of search
- Shows actual project stats

### 2. **DateTime & Timezone Fix** 🕐
- Fixed timezone handling using `Intl.DateTimeFormat`
- Uses browser's local timezone automatically
- Better precision (seconds instead of hours)
- Added validation for invalid dates
- Uses `hour12: true` for 12-hour format

---

## 🐙 GitHub Stats Update

### Before:
```javascript
// Searched for generic Uganda tech repos
const reposResponse = await fetch(
  'https://api.github.com/search/repositories?q=topic:uganda+topic:tech+OR+topic:uganda+topic:technology&sort=stars&per_page=6'
);
```

### After:
```javascript
// Fetches Tech Atlas Uganda repo directly
const repoResponse = await fetch(
  'https://api.github.com/repos/Tech-Atlas-Uganda/tech_atlas'
);

// Fetches contributors from the repo
const contributorsResponse = await fetch(
  'https://api.github.com/repos/Tech-Atlas-Uganda/tech_atlas/contributors?per_page=8'
);
```

### Benefits:
- ✅ Shows actual project stats
- ✅ More relevant data
- ✅ Faster API calls (1 repo instead of 6)
- ✅ Shows Tech Atlas contributors
- ✅ Accurate star/fork counts

---

## 🕐 DateTime Fix

### The Problem:
- Dates stored in database without timezone suffix (timestamp without time zone)
- PostgreSQL returns timestamps without 'Z' suffix
- Browser interprets these as local time instead of UTC
- Low precision (only hours)
- No validation for invalid dates

### The Solution:

#### 1. Proper Date Parsing with UTC Handling
```javascript
const formatDate = (date: Date | string) => {
  // Handle both ISO strings and Date objects
  let d: Date;
  if (typeof date === 'string') {
    // If the string doesn't have timezone info, treat it as UTC
    d = date.includes('Z') || date.includes('+') || date.includes('-') && date.lastIndexOf('-') > 10
      ? new Date(date)
      : new Date(date + 'Z'); // Append Z to treat as UTC
  } else {
    d = new Date(date);
  }
  
  // Validate date
  if (isNaN(d.getTime())) return 'Invalid date';
  
  // Use Intl.DateTimeFormat for proper timezone handling
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }).format(d);
};
```

#### 2. Better Time Precision with UTC Handling
```javascript
const formatTimeAgo = (date: Date | string) => {
  const now = new Date();
  
  // Handle both ISO strings and Date objects
  let past: Date;
  if (typeof date === 'string') {
    // If the string doesn't have timezone info, treat it as UTC
    past = date.includes('Z') || date.includes('+') || date.includes('-') && date.lastIndexOf('-') > 10
      ? new Date(date)
      : new Date(date + 'Z'); // Append Z to treat as UTC
  } else {
    past = new Date(date);
  }
  
  // Validate dates
  if (isNaN(past.getTime())) return 'Invalid date';
  
  // Calculate difference in SECONDS (not hours)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) return "Just now";
  
  // Less than an hour (show minutes)
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  // Less than a day (show hours)
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  // Less than a week (show days)
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  // Less than a month (show weeks)
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
  
  // More than a month - show full date
  return formatDate(date);
};
```

---

## 🌍 Timezone Handling

### How It Works:

**1. Database stores timestamps without timezone:**
```sql
-- PostgreSQL timestamp (without time zone)
-- Stored as: "2024-01-15T14:30:00.000" (no Z suffix)
-- This is actually UTC but doesn't indicate it
```

**2. Fix: Append 'Z' to treat as UTC:**
```javascript
// Database returns: "2024-01-15T14:30:00.000"
// We append 'Z': "2024-01-15T14:30:00.000Z"
const d = date.includes('Z') ? new Date(date) : new Date(date + 'Z');
// Now JavaScript knows it's UTC and converts to local timezone
```

**3. Intl.DateTimeFormat formats in local timezone:**
```javascript
new Intl.DateTimeFormat(undefined, {
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  ...
}).format(d);
// 'undefined' = use browser's locale
// timeZone = explicitly use browser's timezone
// Result: "Jan 15, 2024, 5:30 PM" (if browser is in EAT/UTC+3)
```

### Examples:

**If you're in Uganda (EAT/UTC+3):**
- Database: `2024-01-15T14:30:00.000` (UTC, no Z)
- After fix: `2024-01-15T14:30:00.000Z` (UTC with Z)
- Display: `Jan 15, 2024, 5:30 PM` (EAT = UTC+3)
- Time ago: `2h ago` (if current time is 7:30 PM EAT)

**If you're in USA (EST/UTC-5):**
- Database: `2024-01-15T14:30:00.000` (UTC, no Z)
- After fix: `2024-01-15T14:30:00.000Z` (UTC with Z)
- Display: `Jan 15, 2024, 9:30 AM` (EST = UTC-5)
- Time ago: `2h ago` (if current time is 11:30 AM EST)

---

## 📊 Time Precision Comparison

### Before:
```javascript
// Only calculated hours
const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));

// Results:
// 30 seconds ago → "Just now" ✅
// 30 minutes ago → "Just now" ❌ (should be "30m ago")
// 90 minutes ago → "1h ago" ✅
```

### After:
```javascript
// Calculates seconds first
const diffInSeconds = Math.floor((now - past) / 1000);

// Results:
// 30 seconds ago → "Just now" ✅
// 30 minutes ago → "30m ago" ✅
// 90 minutes ago → "1h ago" ✅
// 2 hours ago → "2h ago" ✅
```

---

## 🧪 Testing

### Test GitHub Stats:
1. Go to `/dashboard`
2. ✅ Should show Tech Atlas Uganda repo stats
3. ✅ Stars count from tech_atlas repo
4. ✅ Forks count from tech_atlas repo
5. ✅ Contributors from tech_atlas repo

### Test DateTime Display:
1. Create a new thread
2. ✅ Should show "Just now"
3. Wait 30 seconds
4. ✅ Still shows "Just now"
5. Wait 2 minutes
6. ✅ Should show "2m ago"
7. Wait 1 hour
8. ✅ Should show "1h ago"

### Test Timezone:
1. Check your browser's timezone
2. Create a thread
3. Check database timestamp (UTC)
4. ✅ Display should be in your local timezone
5. ✅ Time difference should be correct

### Test Invalid Dates:
1. If database has invalid date
2. ✅ Should show "Invalid date" instead of crashing

---

## 📁 Files Modified

1. **client/src/pages/Dashboard.tsx**
   - Updated GitHub API call
   - Now fetches Tech-Atlas-Uganda/tech_atlas
   - Fetches contributors from same repo

2. **client/src/pages/Forum.tsx**
   - Fixed formatDate with Intl.DateTimeFormat
   - Fixed formatTimeAgo with seconds precision
   - Added date validation

3. **client/src/pages/ThreadDetail.tsx**
   - Fixed formatDate with Intl.DateTimeFormat
   - Fixed formatTimeAgo with seconds precision
   - Added date validation

4. **docs/DATETIME_AND_GITHUB_FIX.md** (NEW)
   - This documentation file

---

## 🔍 Debugging DateTime Issues

### Check Browser Timezone:
```javascript
// In browser console:
console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
// Example: "Africa/Kampala" or "America/New_York"
```

### Check Date Conversion:
```javascript
// In browser console:
const utcDate = "2024-01-15T14:30:00.000Z";
const localDate = new Date(utcDate);
console.log(localDate.toString());
// Shows date in your local timezone
```

### Check Database Timestamp:
```sql
-- In Supabase SQL Editor:
SELECT 
    id,
    title,
    "createdAt",
    "createdAt" AT TIME ZONE 'Africa/Kampala' as local_time
FROM forum_threads
ORDER BY "createdAt" DESC
LIMIT 5;
```

---

## 🌍 Supported Timezones

The fix automatically supports ALL timezones because:
- Uses browser's built-in timezone detection
- `Intl.DateTimeFormat(undefined, ...)` = automatic
- No hardcoded timezone offsets
- Works globally

### Examples:
- 🇺🇬 Uganda (EAT): UTC+3
- 🇺🇸 USA East (EST): UTC-5
- 🇬🇧 UK (GMT): UTC+0
- 🇯🇵 Japan (JST): UTC+9
- 🇦🇺 Australia (AEST): UTC+10

All work automatically! ✅

---

## ✅ Summary

### GitHub Stats:
- ✅ Now shows Tech Atlas Uganda repo
- ✅ Direct API call (faster)
- ✅ Accurate stats
- ✅ Real contributors

### DateTime:
- ✅ Proper timezone handling
- ✅ Better precision (seconds)
- ✅ Validation for invalid dates
- ✅ 12-hour format with AM/PM
- ✅ Works globally

### What Changed:
- ✅ GitHub API endpoint
- ✅ DateTime formatting method
- ✅ Time calculation precision
- ✅ Added date validation

---

**DateTime and GitHub stats are now fixed! 🎉**
