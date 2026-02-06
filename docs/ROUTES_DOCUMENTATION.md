# Tech Atlas - Routes & Pages Documentation

## Overview
This document provides a comprehensive list of all routes, pages, and access requirements for the Tech Atlas platform. The platform uses role-based access control with 6 levels of permissions.

---

## 🌐 **Public Routes** (No Authentication Required)

### Core Platform Pages
| Route | Page | Description | Features |
|-------|------|-------------|----------|
| `/` | Home | Landing page with platform overview | Hero section, features showcase, call-to-action |
| `/dashboard` | Dashboard | Platform statistics and overview | Content counts, recent activity, quick links |
| `/map` | Uganda Map | Interactive map of tech ecosystem | Geographic visualization of hubs and startups |
| `/ecosystem` | Ecosystem | Directory of hubs, communities, startups | Search, filter, map view, anonymous submissions |
| `/profiles` | People Directory | Community member profiles | User profiles with skills, categories, filtering |
| `/jobs` | Jobs & Gigs | Job listings and freelance opportunities | Job search, filtering, anonymous submissions |
| `/learning` | Learning Hub | Educational resources and courses | Resource directory, categories, levels |
| `/events` | Events | Tech events and meetups | Event calendar, filtering, anonymous submissions |
| `/blog` | Blog | Platform blog and articles | Article listings, categories, search |
| `/blog/:slug` | Blog Detail | Individual blog post | Full article view, comments |
| `/forum` | Community Forum | Discussion forum | Thread listings, categories, voting |
| `/forum/:slug` | Thread Detail | Individual forum thread | Thread view, replies, voting |

### Information Pages
| Route | Page | Description | Access |
|-------|------|-------------|--------|
| `/about` | About Us | Platform information and mission | Public |
| `/team` | Team | Team member profiles | Public |
| `/contribute` | Contribute | How to contribute to the platform | Public |
| `/governance` | Governance | Platform governance and policies | Public |
| `/privacy` | Privacy Policy | Privacy policy and data handling | Public |
| `/terms` | Terms of Service | Terms and conditions | Public |
| `/code-of-conduct` | Code of Conduct | Community guidelines | Public |
| `/support` | Support | Help and support resources | Public |

### Submission Pages (Anonymous)
| Route | Page | Description | Features |
|-------|------|-------------|----------|
| `/submit/hub` | Submit Hub | Add tech hub or co-working space | Anonymous submission, immediate listing |
| `/submit/job` | Submit Job | Post job or gig opportunity | Anonymous submission, immediate listing |
| `/submit/event` | Submit Event | Create event listing | Anonymous submission, immediate listing |
| `/submit/resource` | Submit Resource | Add learning resource | Anonymous submission, immediate listing |
| `/submit/blog` | Submit Blog | Write blog post | Requires authentication |

### Authentication & Utility
| Route | Page | Description | Purpose |
|-------|------|-------------|---------|
| `/auth/callback` | Auth Callback | OAuth callback handler | Authentication flow |
| `/forum/new` | New Thread | Create forum discussion | Community engagement |
| `/404` | Not Found | 404 error page | Error handling |

---

## 🔐 **Protected Routes** (Authentication Required)

### User Profile Management
| Route | Page | Required Role | Description |
|-------|------|---------------|-------------|
| `/profile/settings` | Profile Settings | Any authenticated user | Update profile, skills, categories |

---

## 👤 **Role-Based Administrative Routes**

### Level 3: Moderator Access
| Route | Page | Required Role | Description | Features |
|-------|------|---------------|-------------|----------|
| `/moderator` | Moderator Dashboard | `moderator`+ | Content moderation interface | Pending content review, moderation logs, user reports |

**Access Requirements:**
- Minimum role: `moderator`
- Also accessible by: `editor`, `admin`, `core_admin`

**Dashboard Features:**
- ⏳ **Pending Content**: Review and approve/reject submissions
- 🚩 **Reports**: Handle user reports and flags
- 💬 **Forum Moderation**: Manage forum discussions
- 📋 **Activity Log**: View moderation history

### Level 4: Editor Access
| Route | Page | Required Role | Description | Features |
|-------|------|---------------|-------------|----------|
| `/editor` | Editor Dashboard | `editor`+ | Editorial management interface | Content quality, featured content, categories |

**Access Requirements:**
- Minimum role: `editor`
- Also accessible by: `admin`, `core_admin`

**Dashboard Features:**
- ✏️ **Content Management**: Edit and enhance content
- ⭐ **Featured Content**: Select homepage features
- 🏷️ **Category Management**: Organize content categories
- 📊 **Editorial Analytics**: Content performance metrics

### Level 5: Admin Access
| Route | Page | Required Role | Description | Features |
|-------|------|---------------|-------------|----------|
| `/admin` | Admin Dashboard | `admin`+ | Platform administration | Analytics, user management, system settings |

**Access Requirements:**
- Minimum role: `admin`
- Also accessible by: `core_admin`

**Dashboard Features:**
- 📈 **Analytics**: Platform usage statistics
- 👥 **User Management**: Manage user accounts
- ⚙️ **Settings**: Platform configuration
- 📊 **Reports**: Comprehensive platform reports

### Level 6: Core Admin Access
| Route | Page | Required Role | Description | Features |
|-------|------|---------------|-------------|----------|
| `/core-admin` | Core Admin Dashboard | `core_admin` | Ultimate platform control | System administration, role management |

**Access Requirements:**
- Exclusive to: `core_admin` role only

**Dashboard Features:**
- 👑 **User & Role Management**: Assign roles, manage permissions
- 🔍 **Audit Logs**: View all system changes
- 🛡️ **Security Settings**: System-level security
- 🗄️ **Database Management**: Direct database access

---

## 🔑 **Role Hierarchy & Access Matrix**

### Role Levels (1-6)
1. **User** - Basic platform access
2. **Contributor** - Trusted content submission
3. **Moderator** - Content moderation
4. **Editor** - Content quality management
5. **Admin** - Platform administration
6. **Core Admin** - Ultimate system control

### Access Inheritance
- Higher roles inherit all permissions from lower roles
- Core Admin can access all routes and features
- Each role has specific dashboard and capabilities

---

## 🚀 **Navigation & Access**

### Sidebar Navigation (Role-Based)
The sidebar dynamically shows navigation links based on user role:

**All Users:**
- Home, Dashboard, Map, Ecosystem, People, Jobs, Learning, Events, Blog, Forum

**Moderator+:**
- + Moderator Dashboard

**Editor+:**
- + Editor Dashboard

**Admin+:**
- + Admin Panel

**Core Admin:**
- + Core Admin Dashboard

### URL Access Patterns
```
Public Routes:        http://localhost:3003/[route]
Protected Routes:     http://localhost:3003/[route] (requires auth)
Admin Routes:         http://localhost:3003/[admin-route] (requires role)
```

---

## 🛡️ **Security & Protection**

### Route Protection Mechanisms
1. **Public Routes**: No restrictions
2. **Protected Routes**: Require authentication
3. **Role-Based Routes**: Require specific role level
4. **Access Denied**: Automatic redirect for insufficient permissions

### Authentication States
- **Unauthenticated**: Access to public routes only
- **Authenticated**: Access to protected routes + role-based routes
- **Role-Based**: Additional access based on assigned role

---

## 📱 **Mobile & Responsive Access**

All routes are fully responsive and accessible on:
- 📱 Mobile devices (iOS/Android)
- 💻 Tablets (iPad/Android tablets)
- 🖥️ Desktop computers
- 🌐 All modern web browsers

---

## 🔧 **Development & Testing**

### Local Development URLs
- **Base URL**: `http://localhost:3003`
- **API Endpoints**: `http://localhost:3003/api/trpc`
- **Static Assets**: `http://localhost:3003/assets`

### Testing Access Levels
To test different role access:
1. Create user account
2. Assign role through Core Admin dashboard
3. Navigate to role-specific routes
4. Verify permissions and features

---

## 📊 **Content Management Routes**

### Anonymous Submission Workflow
1. **Submit**: Use `/submit/*` routes
2. **Immediate Listing**: Content appears instantly
3. **Post-Moderation**: Moderators review and manage

### Moderation Workflow
1. **Review**: Access via role-specific dashboards
2. **Action**: Approve, reject, or delete content
3. **Logging**: All actions recorded in audit logs

---

## 🎯 **Quick Access Guide**

### For Regular Users:
- Browse content: `/ecosystem`, `/jobs`, `/events`, `/learning`
- Submit content: `/submit/*` routes
- Engage: `/forum`, `/blog`
- Profile: `/profile/settings`

### For Moderators:
- Moderation: `/moderator`
- Content review: Pending content queue
- User management: Report handling

### For Editors:
- Editorial: `/editor`
- Content quality: Featured content management
- Organization: Category management

### For Admins:
- Administration: `/admin`
- Analytics: Platform statistics
- User management: Account oversight

### For Core Admins:
- System control: `/core-admin`
- Role management: User role assignment
- Security: System-level settings

---

## 📞 **Support & Documentation**

For questions about routes and access:
- **General Help**: `/support`
- **Governance**: `/governance`
- **Code of Conduct**: `/code-of-conduct`
- **Technical Issues**: Contact Core Administrators

---

*Last Updated: February 2026*  
*Version: 1.0*  
*Platform: Tech Atlas Uganda*  
*Server: http://localhost:3003*