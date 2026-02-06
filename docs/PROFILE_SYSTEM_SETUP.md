# Profile System Setup Guide

## What Was Created

### 1. **Profile Edit Page** (`/profile`)
- Edit personal information (name, bio, skills, location)
- Add social links (website, GitHub, Twitter, LinkedIn)
- Toggle profile visibility (public/private)
- Save changes with real-time updates

### 2. **Settings Page** (`/settings`)
- Account information
- Password reset via email
- Security settings
- Notifications (placeholder)
- Danger zone (account deletion placeholder)

### 3. **People Listing Page** (`/people`)
- Browse public profiles
- Search by name, skills, or location
- Click to view full profile details
- Only shows users with `isPublic = true`

## Setup Steps

### Step 1: Run SQL Migration

Run this in Supabase SQL Editor:

```sql
-- Add profile privacy and avatar fields
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "isPublic" boolean DEFAULT false NOT NULL;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "avatar" varchar(500);

-- Make existing users public by default
UPDATE users SET "isPublic" = true WHERE "isPublic" IS NULL;
```

### Step 2: Add Routes

Add these routes to your router configuration:

```typescript
// In your routes file
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import People from "@/pages/People";

// Add routes:
<Route path="/profile" component={Profile} />
<Route path="/settings" component={Settings} />
<Route path="/people" component={People} />
```

### Step 3: Test the Features

1. **Profile Page**: http://localhost:3001/profile
   - Edit your profile
   - Toggle public/private
   - Save changes

2. **Settings Page**: http://localhost:3001/settings
   - View account info
   - Reset password
   - Navigate between tabs

3. **People Page**: http://localhost:3001/people
   - See public profiles
   - Search members
   - Click to view details

## Features

### Profile Privacy
- **Private** (default): Profile hidden from public listings
- **Public**: Profile visible on /people page

### Profile Fields
- Name
- Email (read-only)
- Bio
- Skills (comma-separated)
- Location
- Website
- GitHub
- Twitter
- LinkedIn

### Password Reset
- Uses Supabase auth
- Sends email with reset link
- Link expires in 1 hour
- Redirects to `/auth/callback?type=recovery`

## API Endpoints

### `user.getProfile`
- **Type**: Protected
- **Returns**: Current user profile

### `user.updateProfile`
- **Type**: Protected
- **Input**: Profile fields + isPublic
- **Returns**: Success status

### `user.listPublicProfiles`
- **Type**: Public
- **Returns**: Array of public user profiles

## Database Schema

```sql
users table:
- isPublic: boolean (default false)
- avatar: varchar(500) (for future use)
- name: text
- bio: text
- skills: json (array of strings)
- location: varchar(255)
- website: varchar(500)
- github: varchar(255)
- twitter: varchar(255)
- linkedin: varchar(255)
```

## Privacy Model

- **Default**: Profiles are private
- **Opt-in**: Users must toggle "Public" to appear in listings
- **Public data**: Name, bio, skills, location, social links
- **Hidden data**: Email, account ID, internal metadata

## Future Enhancements

- [ ] Avatar upload
- [ ] Profile slugs/usernames
- [ ] Follow/connection system
- [ ] Activity feed
- [ ] Email notifications
- [ ] Account deletion
- [ ] Profile completeness indicator
- [ ] Skill endorsements
- [ ] Portfolio/projects section

## Troubleshooting

### Profiles not showing on /people
- Check `isPublic` is true in database
- Verify SQL migration ran successfully
- Check browser console for errors

### Password reset not working
- Verify Supabase email settings
- Check email templates in Supabase dashboard
- Ensure redirect URL is whitelisted

### Profile updates not saving
- Check user is authenticated
- Verify database connection
- Check browser console for errors
- Ensure router endpoint is working

## Files Created

1. `client/src/pages/Profile.tsx` - Profile edit page
2. `client/src/pages/Settings.tsx` - Settings page
3. `client/src/pages/People.tsx` - Public profiles listing
4. `add-user-profile-fields.sql` - Database migration
5. `PROFILE_SYSTEM_SETUP.md` - This guide

## Files Modified

1. `server/routers.ts` - Added `listPublicProfiles` endpoint
2. `server/db.ts` - Added `getPublicUsers()` function
3. `drizzle/schema-postgres.ts` - Added `isPublic` and `avatar` fields
