# Tech Atlas Role Hierarchy & Access Control System

## Overview
Tech Atlas implements a comprehensive 6-level role hierarchy system that provides granular access control and governance capabilities. Each role builds upon the permissions of lower levels while adding specific administrative capabilities.

## Role Hierarchy Structure

### Level 1: User 👤
**Role:** `user`  
**Display Name:** Community Member  
**Description:** Regular platform user with basic access

**Permissions:**
- View all public content (events, jobs, learning resources, etc.)
- Submit content for moderation approval
- Participate in community forum discussions
- Update personal profile information
- Access basic platform features

**Access:**
- All public pages
- Profile settings
- Content submission forms
- Forum participation

---

### Level 2: Contributor 📝
**Role:** `contributor`  
**Display Name:** Content Contributor  
**Description:** Trusted user who can submit content with reduced moderation requirements

**Additional Permissions:**
- Fast-track content submissions (less moderation required)
- Priority review for submitted content
- Enhanced submission capabilities

**Access:**
- All User permissions
- Enhanced submission forms
- Contributor-specific features

---

### Level 3: Moderator 🛡️
**Role:** `moderator`  
**Display Name:** Content Moderator  
**Description:** Moderates content and manages community discussions

**Additional Permissions:**
- Moderate and approve/reject submitted content
- Manage forum discussions and threads
- View moderation reports and logs
- Moderate user behavior and content
- Assign User and Contributor roles

**Access:**
- All Contributor permissions
- `/moderator` - Moderation dashboard
- Content approval/rejection tools
- Forum moderation tools
- User moderation capabilities

**Dashboard Features:**
- Pending content review queue
- Moderation action logging
- Community management tools
- User reports handling

---

### Level 4: Editor ✏️
**Role:** `editor`  
**Display Name:** Content Editor  
**Description:** Manages content quality and editorial standards

**Additional Permissions:**
- Edit and enhance approved content
- Manage content categories and tags
- Feature content on platform homepage
- Content quality oversight
- Assign User, Contributor, and Moderator roles

**Access:**
- All Moderator permissions
- `/editor` - Editorial dashboard
- Content editing and enhancement tools
- Category management system
- Featured content management

**Dashboard Features:**
- Content quality management
- Featured content selection
- Category and tag management
- Editorial analytics and insights

---

### Level 5: Admin 👨‍💼
**Role:** `admin`  
**Display Name:** Platform Administrator  
**Description:** Full platform administration except core system management

**Additional Permissions:**
- Manage platform users and their roles
- View comprehensive analytics and reports
- Manage platform settings and configuration
- Perform bulk operations on content
- Assign User, Contributor, Moderator, and Editor roles

**Access:**
- All Editor permissions
- `/admin` - Administrative dashboard
- User management tools
- Platform analytics
- System configuration

**Dashboard Features:**
- User management and role assignment
- Platform analytics and reporting
- System settings management
- Bulk content operations

---

### Level 6: Core Admin 👑
**Role:** `core_admin`  
**Display Name:** Core Administrator  
**Description:** Ultimate platform control with system-level access

**Additional Permissions:**
- Manage all administrators and their roles
- Access system-level configuration
- Database administration capabilities
- Security settings management
- Assign any role including Admin and Core Admin

**Access:**
- All Admin permissions
- `/core-admin` - Core administration dashboard
- System-level management tools
- Database administration
- Security configuration

**Dashboard Features:**
- Complete user and role management
- System administration tools
- Database management interface
- Security and audit controls
- Role hierarchy management

## Permission Matrix

| Permission | User | Contributor | Moderator | Editor | Admin | Core Admin |
|------------|------|-------------|-----------|--------|-------|------------|
| View Content | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Submit Content | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Forum Participation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Update Profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Fast-track Submissions | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Moderate Content | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Manage Forum | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Edit Content | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage Categories | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Feature Content | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View Analytics | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| System Config | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Database Access | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

## Role Assignment Rules

### Who Can Assign Roles:
- **Core Admin**: Can assign any role (including other Core Admins)
- **Admin**: Can assign User, Contributor, Moderator, Editor roles
- **Editor**: Can assign User, Contributor, Moderator roles
- **Moderator**: Can assign User, Contributor roles
- **Contributor**: Cannot assign roles
- **User**: Cannot assign roles

### Role Assignment Restrictions:
- Users cannot assign roles higher than their own level
- Role changes are logged in the audit system
- Core Admin approval may be required for sensitive role changes
- Deactivated users cannot be assigned new roles

## Access Control Implementation

### Frontend Protection:
```typescript
// Role-based route protection
<ProtectedRoute requireRole="moderator">
  <ModeratorDashboard />
</ProtectedRoute>

// Component-level role checking
{user?.role === 'core_admin' && <CoreAdminTools />}
```

### Backend Authorization:
```typescript
// Role-based procedure middleware
const moderatorProcedure = protectedProcedure.use(({ ctx, next }) => {
  const allowedRoles = ['moderator', 'editor', 'admin', 'core_admin'];
  if (!allowedRoles.includes(ctx.user.role)) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});
```

## Database Schema

### Core Tables:
- `users` - User accounts with role assignments
- `role_hierarchy` - Role definitions and permissions
- `role_audit_log` - Role change tracking
- `moderation_log` - Moderation action history

### Key Fields:
- `users.role` - Current user role
- `users.roleAssignedAt` - When role was assigned
- `users.assignedBy` - Who assigned the role
- `users.isActive` - Account status

## Security Features

### Audit Logging:
- All role changes are logged with timestamp and reason
- Moderation actions are tracked with full context
- System access is monitored and recorded

### Permission Validation:
- Server-side role validation on all protected endpoints
- Client-side role checking for UI elements
- Database-level constraints where applicable

### Role Escalation Protection:
- Users cannot elevate their own roles
- Role assignments require appropriate permissions
- Audit trail for all administrative actions

## Getting Started

### For New Administrators:
1. Core Admin creates your account with appropriate role
2. Access your role-specific dashboard via the sidebar
3. Review the permissions and capabilities for your role
4. Start with basic tasks before moving to advanced features

### For Developers:
1. Use `ProtectedRoute` component for role-based page access
2. Implement role checks in components using user context
3. Use appropriate procedure middleware in tRPC routes
4. Log administrative actions using the moderation system

## Support & Documentation

For questions about roles and permissions:
- Contact Core Administrators for role assignments
- Review this document for permission clarifications
- Check the governance documentation for policy details
- Use the support system for technical issues

---

*Last Updated: February 2026*  
*Version: 1.0*  
*System: Tech Atlas Uganda*