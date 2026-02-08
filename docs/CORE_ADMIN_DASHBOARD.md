# Core Admin Dashboard - Complete Guide

## 🎯 Overview

The Core Admin Dashboard provides **complete platform control** with full CRUD operations for all data, user management, content moderation, system administration, and database access.

**Route:** `/core-admin`  
**Access:** Core Admin role only

---

## 📊 Dashboard Features

### 5 Main Tabs:

1. **Users** - Complete user management
2. **Content** - Full content CRUD operations
3. **Roles** - Role hierarchy management
4. **Audit Log** - Track all administrative actions
5. **System** - System administration and settings

---

## 👥 Tab 1: Users

### Features:

#### User Management:
- ✅ View all platform users
- ✅ Search users by name, email, or role
- ✅ See user status (active/inactive)
- ✅ View role assignment history

#### Role Assignment:
- ✅ Change any user's role
- ✅ Assign ANY role (including Core Admin)
- ✅ Provide reason for role changes
- ✅ Instant updates with confirmation

#### User Actions:
- ✅ Deactivate user accounts
- ✅ View user details
- ✅ Track role assignment dates
- ✅ See who assigned roles

### How to Use:

#### Change User Role:
1. Find the user in the list
2. Click **"Change Role"** button
3. Select new role from dropdown
4. (Optional) Provide reason
5. Click **"Update Role"**
6. ✅ Role updated and logged

#### Deactivate User:
1. Find the user
2. Click the **red X button**
3. Confirm deactivation
4. ✅ User account deactivated

#### Search Users:
- Type in search box to filter by:
  - Name
  - Email
  - Role

---

## 📁 Tab 2: Content

### Features:

#### Content Overview:
- ✅ View counts for all content types
- ✅ Blog Posts
- ✅ Forum Threads
- ✅ Events
- ✅ Jobs
- ✅ Learning Resources
- ✅ Opportunities

#### Content Management:
- ✅ **Delete Test Data** - Remove all test content
- ✅ **Database Query** - Run custom SQL queries
- ✅ **Platform Metrics** - View detailed analytics
- ✅ **Content Review** - Moderate all content

#### Quick Actions:
- ✅ Export Data
- ✅ Import Data
- ✅ Backup Database
- ✅ View System Logs

### How to Use:

#### Delete Test Data:
1. Go to Content tab
2. Click **"Delete All Test Data"**
3. Confirm deletion
4. ✅ All test content removed

#### View Content Stats:
- See real-time counts for each content type
- Click **"Manage →"** to view specific content

#### Run Database Queries:
1. Click **"Open Query Console"**
2. Write SQL query
3. Execute
4. View results

---

## 🎭 Tab 3: Roles

### Features:

#### Role Hierarchy Display:
- ✅ View all 6 role levels
- ✅ See role descriptions
- ✅ View permissions for each role
- ✅ See which roles can be assigned by each level

#### Role Information:
- **Level 1:** User (Basic access)
- **Level 2:** Contributor (Trusted submissions)
- **Level 3:** Moderator (Content moderation)
- **Level 4:** Editor (Content editing)
- **Level 5:** Admin (Platform administration)
- **Level 6:** Core Admin (Ultimate control)

### How to Use:

#### View Role Details:
- Each role card shows:
  - Role level (1-6)
  - Display name
  - Description
  - Assignable roles
  - Role name (system identifier)

---

## 📜 Tab 4: Audit Log

### Features:

#### Track All Changes:
- ✅ View all role changes
- ✅ See who made changes
- ✅ View reasons for changes
- ✅ Timestamp for each action
- ✅ Previous and new roles

#### Audit Information:
- User ID
- Previous role → New role
- Assigned by (User ID)
- Reason provided
- Date and time

### How to Use:

#### Review Audit Log:
1. Go to Audit Log tab
2. See chronological list of changes
3. Click **Refresh** to update
4. Review reasons and timestamps

#### Audit Entry Details:
- **Blue icon** - Role change action
- **Badges** - Show role transition
- **Timestamp** - When change occurred
- **Reason** - Why change was made

---

## ⚙️ Tab 5: System

### Features:

#### System Stats:
- ✅ Database status (PostgreSQL)
- ✅ System status (Operational)
- ✅ Security status (Active)

#### Database Management:
- ✅ View database schema
- ✅ Run SQL queries
- ✅ Backup database
- ✅ Database maintenance

#### Security & Monitoring:
- ✅ View system logs
- ✅ Security dashboard
- ✅ View alerts
- ✅ Monitor system health

#### Analytics & Metrics:
- ✅ Platform analytics
- ✅ User analytics
- ✅ Performance metrics
- ✅ Engagement statistics

#### Platform Settings:
- ✅ General settings
- ✅ Security settings
- ✅ Content settings
- ✅ System configuration

#### Danger Zone:
- ⚠️ Delete all test data
- ⚠️ Reset database
- ⚠️ Irreversible actions

### How to Use:

#### Access Database:
1. Go to System tab
2. Click **"Database Management"**
3. Choose action:
   - View Schema
   - Run Query
   - Backup

#### View Analytics:
1. Click **"Analytics & Metrics"**
2. Choose metric type:
   - Platform Analytics
   - User Analytics
   - Performance Metrics

#### Danger Zone Actions:
1. Scroll to **"Danger Zone"**
2. Click action button
3. **Confirm** (these are irreversible!)
4. Action executed

---

## 🔐 Security Features

### Access Control:
- ✅ Only Core Admins can access
- ✅ All actions are logged
- ✅ Audit trail for accountability
- ✅ Cannot change own role
- ✅ Cannot deactivate yourself

### Audit Logging:
- ✅ Every role change logged
- ✅ Timestamp recorded
- ✅ Reason captured
- ✅ Assigner tracked

### Permissions:
- ✅ Assign ANY role
- ✅ Deactivate ANY user (except self)
- ✅ Delete ANY content
- ✅ Access ALL data
- ✅ Modify system settings

---

## 📊 Dashboard Stats

### Top Stats Bar:
- **Total Users** - All registered users
- **Blog Posts** - Published blog posts
- **Forum Threads** - Active discussions
- **Events** - Upcoming and past events

### Real-time Updates:
- Stats refresh automatically
- Click **Refresh** button to update manually
- Toast notifications for actions

---

## 🎯 Common Tasks

### Task 1: Assign Moderator Role
1. Go to **Users** tab
2. Search for user
3. Click **"Change Role"**
4. Select **"Moderator"**
5. Provide reason: "Active contributor with good judgment"
6. Click **"Update Role"**
7. ✅ Done!

### Task 2: Delete Test Data
1. Go to **Content** tab
2. Click **"Delete All Test Data"**
3. Confirm deletion
4. ✅ All test content removed

### Task 3: View Audit Log
1. Go to **Audit Log** tab
2. Review recent changes
3. Check reasons and timestamps
4. ✅ Full accountability

### Task 4: Deactivate User
1. Go to **Users** tab
2. Find user
3. Click **red X button**
4. Confirm deactivation
5. ✅ User deactivated

### Task 5: Run Database Query
1. Go to **System** tab
2. Click **"Database Management"**
3. Click **"Run SQL Query"**
4. Enter query
5. Execute
6. ✅ View results

---

## 🚨 Important Notes

### Cannot Do:
- ❌ Change your own role
- ❌ Deactivate yourself
- ❌ Delete Core Admin role
- ❌ Bypass audit logging

### Best Practices:
1. **Always provide reasons** for role changes
2. **Review audit log** regularly
3. **Be careful** with Danger Zone actions
4. **Backup database** before major changes
5. **Document** important decisions

### Safety Features:
- Confirmation dialogs for destructive actions
- Audit trail for all changes
- Cannot modify own account
- Role hierarchy enforcement

---

## 🧪 Testing

### Test User Management:
1. Create test user
2. Assign different roles
3. Check audit log
4. Deactivate user
5. ✅ Verify all actions logged

### Test Content Management:
1. Create test content
2. View in Content tab
3. Delete test data
4. ✅ Verify deletion

### Test Audit Log:
1. Make role changes
2. Check audit log
3. ✅ Verify entries appear

---

## 📱 UI Features

### Search & Filter:
- Real-time search
- Filter by role
- Sort by date
- Pagination (coming soon)

### Responsive Design:
- Works on desktop
- Tablet optimized
- Mobile friendly

### Visual Indicators:
- Color-coded roles
- Status badges
- Icons for actions
- Toast notifications

---

## 🎨 Design Elements

### Color Coding:
- **Yellow/Gold** - Core Admin
- **Orange** - Admin
- **Purple** - Editor
- **Blue** - Moderator
- **Green** - Contributor
- **Gray** - User

### Icons:
- 👑 Crown - Core Admin
- 🛡️ Shield - Security
- 👥 Users - User management
- 📁 File - Content
- 📊 Chart - Analytics
- ⚙️ Gear - Settings

---

## ✅ Success Indicators

When everything is working:
- ✅ Can access `/core-admin`
- ✅ See all 5 tabs
- ✅ View all users
- ✅ Change user roles
- ✅ See audit log entries
- ✅ Access system settings
- ✅ View content stats

---

## 🆘 Troubleshooting

### Issue: Can't access dashboard
**Solution:** Verify you have core_admin role in database

### Issue: Role changes not saving
**Solution:** Check browser console for errors, verify backend is running

### Issue: Audit log empty
**Solution:** Make a role change to create entries

### Issue: Stats not showing
**Solution:** Click Refresh button, check database connection

---

## 📚 Related Documentation

- `docs/GOVERNANCE_SYSTEM_COMPLETE.md` - Complete governance system
- `docs/ROLE_HIERARCHY.md` - Role hierarchy details
- `docs/SETUP_CORE_ADMIN.md` - Setup guide
- `TROUBLESHOOT_CORE_ADMIN.md` - Troubleshooting guide

---

## 🎉 Summary

The Core Admin Dashboard provides:

✅ **Complete user management** - Assign roles, deactivate users  
✅ **Full content control** - CRUD operations on all content  
✅ **Role hierarchy** - View and understand all roles  
✅ **Audit logging** - Track all administrative actions  
✅ **System administration** - Database, security, analytics  
✅ **Safety features** - Confirmations, audit trail, restrictions  

**You have ultimate platform control!** 🚀

---

*Last Updated: February 2026*  
*Version: 2.0*  
*Dashboard: Core Admin*
