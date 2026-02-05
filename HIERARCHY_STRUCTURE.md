# Tech Atlas Uganda - Role Hierarchy Structure

## Platform Role Hierarchy

The Tech Atlas Uganda platform implements a 6-level role hierarchy system that provides structured access control and administrative capabilities.

### Level 6: Core Admin
- **Ultimate platform control**
- **Permissions:**
  - Manage all platform settings and configurations
  - Assign and revoke all roles (including other admins)
  - Access to all administrative dashboards
  - Full database and system access
  - Platform-wide content management
  - User account management and deactivation
  - Role hierarchy management
  - System analytics and reporting

### Level 5: Admin
- **Platform administration**
- **Permissions:**
  - Manage content across all categories
  - Assign roles up to Editor level
  - Access admin dashboard
  - User management (except other admins)
  - Content approval and rejection
  - Moderation oversight
  - Analytics access
  - Email system management

### Level 4: Editor
- **Content quality management**
- **Permissions:**
  - Edit and manage all content types
  - Assign Moderator and Contributor roles
  - Access editor dashboard
  - Content curation and featured content selection
  - Blog post management and publishing
  - Learning resource management
  - Event and opportunity management

### Level 3: Moderator
- **Content moderation**
- **Permissions:**
  - Review and moderate submitted content
  - Approve/reject pending submissions
  - Assign Contributor roles
  - Access moderator dashboard
  - Delete inappropriate content
  - Manage community forum
  - Handle user reports and complaints

### Level 2: Contributor
- **Trusted content submission**
- **Permissions:**
  - Submit content with priority review
  - Create blog posts (pending approval)
  - Enhanced profile features
  - Community forum participation
  - Direct content submission without anonymous status

### Level 1: User
- **Basic platform access**
- **Permissions:**
  - Browse all public content
  - Anonymous content submission
  - Basic profile management
  - Community forum participation
  - Job and opportunity browsing

## Role Assignment Rules

1. **Hierarchical Assignment**: Users can only assign roles at their level or below
2. **Core Admin Exception**: Only Core Admins can assign Admin and Core Admin roles
3. **Audit Trail**: All role changes are logged with timestamp, assigner, and reason
4. **Role Inheritance**: Higher roles inherit all permissions of lower roles

## Access Control Matrix

| Feature | User | Contributor | Moderator | Editor | Admin | Core Admin |
|---------|------|-------------|-----------|--------|-------|------------|
| Browse Content | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Submit Content | ✅ (Anonymous) | ✅ (Trusted) | ✅ | ✅ | ✅ | ✅ |
| Moderate Content | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Edit Content | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Assign Roles | ❌ | ❌ | Contributor | Moderator+ | Editor+ | All |
| System Config | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

## Dashboard Access

- **Core Admin Dashboard**: `/core-admin` - Complete platform control
- **Admin Dashboard**: `/admin` - Platform administration
- **Editor Dashboard**: `/editor` - Content management
- **Moderator Dashboard**: `/moderator` - Content moderation
- **User Profile**: `/profile` - Personal settings (all users)

## Implementation Details

- **Database Tables**: `users`, `role_hierarchy`, `role_audit_log`, `moderation_log`
- **Authentication**: Role-based middleware protection
- **Frontend**: Conditional navigation and feature access
- **API**: Role-specific procedure protection using tRPC

## Security Features

1. **Role Validation**: Server-side role verification for all protected operations
2. **Audit Logging**: Complete trail of all role changes and administrative actions
3. **Session Management**: Role-based session validation
4. **Permission Inheritance**: Automatic permission cascading
5. **Deactivation Support**: User account deactivation without deletion

This hierarchy ensures proper governance while maintaining flexibility for platform growth and community management.