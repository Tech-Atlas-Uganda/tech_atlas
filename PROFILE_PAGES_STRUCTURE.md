# Profile Pages Structure - Final Setup ✅

## Page Structure

### 1. `/profile` - View Profile (READ-ONLY)
**Purpose:** Display your profile information in a clean, read-only view

**Features:**
- ✅ View avatar
- ✅ View name, email, bio
- ✅ View skills (as badges)
- ✅ View location
- ✅ View social links (clickable)
- ✅ View privacy status (public/private)
- ✅ View account info (role, member since)
- ✅ "Edit Profile" button → links to `/profile/settings`

**No Editing:** This page is for viewing only. Click "Edit Profile" to make changes.

---

### 2. `/profile/settings` - Edit Profile (FULL EDITING)
**Purpose:** Edit all your profile information including avatar upload

**Features:**
- ✅ Upload/change avatar
- ✅ Edit name, bio, skills, location
- ✅ Edit social links (website, GitHub, Twitter, LinkedIn)
- ✅ Toggle profile visibility (public/private)
- ✅ Save changes button
- ✅ All form fields with validation

**This is the OLD ProfileSettings.tsx page** - It already has avatar upload functionality built in.

---

### 3. `/settings` - Account Settings
**Purpose:** Manage account security and preferences

**Tabs:**
1. **Account** - View account info, links to view/edit profile
2. **Security** - Password reset, login method
3. **Notifications** - Notification preferences (coming soon)
4. **Danger Zone** - Account deletion (coming soon)

**Features:**
- ✅ Display avatar in Account tab
- ✅ Password reset via email
- ✅ View account ID
- ✅ Links to "View Profile" and "Edit Profile"

---

### 4. `/people` - Public Profiles Directory
**Purpose:** Browse public profiles of other users

**Features:**
- ✅ Search by name, skills, location
- ✅ View avatars in cards
- ✅ Click for detailed profile view
- ✅ Only shows users with `isPublic = true`

---

## Navigation Flow

```
/profile (View) 
    ↓ Click "Edit Profile"
/profile/settings (Edit)
    ↓ Make changes & Save
/profile (View updated profile)

OR

/settings (Account Settings)
    ↓ Click "Edit Profile"
/profile/settings (Edit)
    ↓ Click "View Profile"
/profile (View)
```

## Routes Configuration

```typescript
// In App.tsx
<Route path="/profile/settings">  {/* Must come FIRST */}
  <ProfileSettings />  {/* Full editing with avatar upload */}
</Route>
<Route path="/profile">
  <Profile />  {/* Read-only view */}
</Route>
<Route path="/settings">
  <Settings />  {/* Account settings */}
</Route>
<Route path="/people">
  <People />  {/* Public directory */}
</Route>
```

**IMPORTANT:** `/profile/settings` must come before `/profile` in the routes, otherwise `/profile` will match first and `/profile/settings` will never be reached.

## File Locations

1. `client/src/pages/Profile.tsx` - View-only profile page
2. `client/src/pages/ProfileSettings.tsx` - Full profile editing with avatar upload
3. `client/src/pages/Settings.tsx` - Account settings
4. `client/src/pages/People.tsx` - Public profiles directory

## Avatar Upload Location

**Avatar upload is in `/profile/settings`** (ProfileSettings.tsx)

The old ProfileSettings.tsx page already has avatar upload functionality. Users should go there to:
- Upload/change avatar
- Edit all profile fields
- Toggle public/private
- Save changes

## Quick Reference

| URL | Page | Purpose | Can Edit? |
|-----|------|---------|-----------|
| `/profile` | Profile.tsx | View your profile | ❌ No |
| `/profile/settings` | ProfileSettings.tsx | Edit profile & upload avatar | ✅ Yes |
| `/settings` | Settings.tsx | Account settings | Partial |
| `/people` | People.tsx | Browse public profiles | ❌ No |

## User Journey

1. **View Profile:** Go to `/profile`
2. **Want to edit?** Click "Edit Profile" → `/profile/settings`
3. **Upload avatar:** On `/profile/settings` page
4. **Change password:** Go to `/settings` → Security tab
5. **See others:** Go to `/people`

## Testing

1. ✅ Go to `/profile` - Should show read-only view with "Edit Profile" button
2. ✅ Click "Edit Profile" - Should go to `/profile/settings`
3. ✅ On `/profile/settings` - Should see full editing form with avatar upload
4. ✅ Go to `/settings` - Should see account settings with links to both pages
5. ✅ Go to `/people` - Should see public profiles directory

All pages are now properly separated and functional!
