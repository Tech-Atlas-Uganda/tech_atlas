# 🤝 Contributing to Tech Atlas Uganda

<div align="center">

**Thank you for your interest in contributing to Tech Atlas!**

We're building Uganda's tech ecosystem infrastructure together, and we welcome contributions from developers, designers, content creators, and community members of all skill levels.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-aifestug.com-blue?style=flat-square)](https://aifestug.com)
[![Email](https://img.shields.io/badge/📧_Contact-ronlinx6@gmail.com-green?style=flat-square)](mailto:ronlinx6@gmail.com)

</div>

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Ways to Contribute](#-ways-to-contribute)
- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [Code Guidelines](#-code-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Community Guidelines](#-community-guidelines)
- [Recognition](#-recognition)

---

## 📜 Code of Conduct

Tech Atlas is committed to providing a **welcoming and inclusive environment** for all contributors. 

### Our Standards

✅ **We encourage:**
- Respectful and constructive communication
- Collaborative problem-solving
- Helping newcomers get started
- Celebrating community achievements
- Giving credit where it's due

❌ **We don't tolerate:**
- Harassment or discrimination of any kind
- Disrespectful or unprofessional behavior
- Spam or self-promotion
- Violation of privacy or confidentiality

**Violations may result in temporary or permanent ban from the project.**

---

## 🎯 Ways to Contribute

There are many ways to contribute to Tech Atlas beyond writing code!

### 💻 Code Contributions

<table>
<tr>
<td width="50%">

**Frontend Development**
- React components
- UI/UX improvements
- Responsive design
- Accessibility features
- Performance optimization

</td>
<td width="50%">

**Backend Development**
- API endpoints (tRPC)
- Database queries
- Authentication & authorization
- Data validation
- Server optimization

</td>
</tr>
</table>

### 📝 Content Contributions

- **Ecosystem Data** - Add hubs, communities, startups
- **Job Listings** - Post opportunities
- **Events** - Share tech events and meetups
- **Blog Posts** - Write articles and guides
- **Learning Resources** - Curate educational content

### 🎨 Design Contributions

- UI/UX improvements
- Visual assets and graphics
- Marketing materials
- Brand identity
- Accessibility enhancements

### 📚 Documentation

- Technical documentation
- User guides and tutorials
- API documentation
- Translation to local languages
- Video tutorials

### 🛡️ Community Moderation

- Review submissions
- Moderate forum discussions
- Maintain content quality
- Help community members
- Enforce community guidelines

---

## 🚀 Getting Started

### Step 1: Prerequisites

Ensure you have these installed:

```bash
✅ Node.js 22.x or higher
✅ pnpm package manager
✅ Git
✅ PostgreSQL or Supabase account
✅ Code editor (VS Code recommended)
```

### Step 2: Fork & Clone

1. **Fork the repository** on GitHub
2. **Clone your fork:**

```bash
git clone https://github.com/YOUR_USERNAME/tech-atlas-uganda.git
cd tech-atlas-uganda
```

3. **Add upstream remote:**

```bash
git remote add upstream https://github.com/original/tech-atlas-uganda.git
```

### Step 3: Install Dependencies

```bash
pnpm install
```

### Step 4: Set Up Environment

Create a `.env` file:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your-api-key

# JWT
JWT_SECRET=your-secret-key
```

### Step 5: Set Up Database

```bash
# Push database schema
pnpm db:push

# Or run migrations
pnpm db:migrate
```

### Step 6: Start Development Server

```bash
pnpm dev
```

🎉 **You're ready!** Visit `http://localhost:3000`

---

## 🔄 Development Workflow

### 1️⃣ Create a Feature Branch

Use descriptive branch names:

```bash
# Features
git checkout -b feature/add-startup-filtering
git checkout -b feature/user-profile-page

# Bug fixes
git checkout -b fix/forum-reply-bug
git checkout -b fix/map-marker-display

# Documentation
git checkout -b docs/update-readme
git checkout -b docs/api-documentation
```

### 2️⃣ Make Your Changes

- Write clean, readable code
- Follow the code guidelines below
- Add comments for complex logic
- Update documentation if needed

### 3️⃣ Write Tests

```bash
# Create test file
server/feature.test.ts

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### 4️⃣ Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add filtering by focus area to startup directory"
git commit -m "fix: resolve forum reply notification bug"
git commit -m "docs: update API documentation for user endpoints"
```

**Commit Message Format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 5️⃣ Keep Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge into your branch
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

---

## 📏 Code Guidelines

### TypeScript Standards

✅ **Do:**
```typescript
// Define explicit types
interface UserProfile {
  name: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
}

function getUser(id: number): Promise<UserProfile> {
  return db.getUserById(id);
}
```

❌ **Don't:**
```typescript
// Avoid 'any' type
function getUser(id: any): any {
  return db.getUserById(id);
}
```

### React Component Guidelines

✅ **Good Component:**
```typescript
interface ProfileCardProps {
  name: string;
  role: string;
  bio?: string;
}

export function ProfileCard({ name, role, bio }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{role}</CardDescription>
      </CardHeader>
      {bio && (
        <CardContent>
          <p>{bio}</p>
        </CardContent>
      )}
    </Card>
  );
}
```

**Component Best Practices:**
- Use functional components with hooks
- Use named exports
- Define prop types with TypeScript interfaces
- Keep components focused and small
- Extract complex logic into custom hooks

### Styling with Tailwind CSS

✅ **Do:**
```tsx
<div className="flex items-center gap-4 p-6 rounded-lg bg-card hover:shadow-lg transition-shadow">
  <Avatar />
  <div className="flex-1">
    <h3 className="text-lg font-semibold">{name}</h3>
    <p className="text-sm text-muted-foreground">{role}</p>
  </div>
</div>
```

**Styling Best Practices:**
- Use Tailwind utility classes
- Follow mobile-first approach
- Use design tokens from `index.css`
- Ensure accessibility (ARIA labels, keyboard navigation)
- Test on multiple screen sizes

### Backend Development (tRPC)

✅ **Good Procedure:**
```typescript
getHubs: publicProcedure
  .input(z.object({
    location: z.string().optional(),
    verified: z.boolean().optional(),
    limit: z.number().min(1).max(100).default(20),
  }))
  .query(async ({ input }) => {
    return await db.getHubs({
      location: input.location,
      verified: input.verified,
      limit: input.limit,
    });
  }),
```

**Backend Best Practices:**
- Use Zod for input validation
- Use appropriate procedure types:
  - `publicProcedure` - No authentication required
  - `protectedProcedure` - Requires authentication
  - `adminProcedure` - Requires admin role
- Handle errors gracefully
- Add logging for debugging
- Optimize database queries

### Database Schema

When modifying the database:

1. **Update schema file:** `drizzle/schema-postgres.ts`
2. **Generate migration:** `pnpm db:push`
3. **Update TypeScript types**
4. **Create helper functions:** `server/db.ts`
5. **Write tests**

---

## 🔀 Pull Request Process

### Before Submitting

**Checklist:**
- [ ] All tests pass (`pnpm test`)
- [ ] TypeScript compiles (`pnpm build`)
- [ ] Code follows style guidelines
- [ ] Documentation updated (if needed)
- [ ] Commit messages are clear
- [ ] Branch is up to date with main

### Submitting Your PR

1. **Push your branch:**
```bash
git push origin feature/your-feature-name
```

2. **Create Pull Request on GitHub**

3. **Fill out the PR template:**
   - **Title:** Clear, descriptive title
   - **Description:** What changes were made and why
   - **Related Issues:** Link to related issues
   - **Testing:** How you tested the changes
   - **Screenshots:** For UI changes

### PR Review Process

Your PR will be reviewed by maintainers:

1. **Code Review** - Code quality and standards
2. **Functionality Test** - Does it work as expected?
3. **Design Review** - UI/UX considerations
4. **Security Check** - Any security concerns?
5. **Documentation** - Is documentation updated?

**Be prepared to:**
- Answer questions about your changes
- Make revisions based on feedback
- Discuss alternative approaches
- Rebase if conflicts arise

### After Merge

🎉 **Congratulations!** Your contribution is now part of Tech Atlas!

```bash
# Clean up
git checkout main
git pull upstream main
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

---

## 💬 Community Guidelines

### Communication Channels

| Channel | Purpose |
|---------|---------|
| 🐛 **GitHub Issues** | Bug reports, feature requests |
| 💬 **GitHub Discussions** | General questions, ideas |
| 📧 **Email** | ronlinx6@gmail.com - Private inquiries |
| 🌐 **Live Demo** | [aifestug.com](https://aifestug.com) |

### Reporting Bugs

**Good Bug Report:**
```markdown
**Bug Description:**
Avatar upload fails with "Bucket not found" error

**Steps to Reproduce:**
1. Go to /profile/settings
2. Click "Upload New Photo"
3. Select an image
4. Click upload

**Expected Behavior:**
Image should upload successfully

**Actual Behavior:**
Error: "Bucket not found"

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Node: 22.0.0
```

### Suggesting Features

**Good Feature Request:**
```markdown
**Problem:**
Users can't filter jobs by salary range

**Proposed Solution:**
Add salary range filter with min/max inputs

**Alternatives Considered:**
- Salary brackets (e.g., 0-1M, 1M-3M)
- Salary tags

**Benefits:**
- Better job discovery
- Improved user experience
- More relevant results
```

---

## 🏆 Recognition

All contributors are valued and recognized!

### Contributor Levels

| Level | Criteria | Benefits |
|-------|----------|----------|
| 🌱 **Contributor** | First merged PR | Listed in contributors |
| 🌿 **Active Contributor** | 5+ merged PRs | Recognition on Team page |
| 🌳 **Core Contributor** | 20+ merged PRs | Moderator invitation |
| 🏅 **Maintainer** | Consistent contributions | Governance participation |

### Ways We Recognize Contributors

- 📝 Listed in `CONTRIBUTORS.md`
- 🌐 Featured on Team page
- 🎤 Speaking opportunities at events
- 🗳️ Participation in governance decisions
- 🎁 Swag and merchandise (when available)

---

## ❓ Questions?

### Need Help?

- 📖 **Documentation:** [docs/README.md](docs/README.md)
- 🚀 **Setup Guide:** [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md)
- 🐛 **Troubleshooting:** [docs/QUICK_FIX_GUIDE.md](docs/QUICK_FIX_GUIDE.md)
- 📧 **Email:** ronlinx6@gmail.com

### Want to Chat?

- 💬 GitHub Discussions for public questions
- 📧 Email for private inquiries
- 🌐 Visit [aifestug.com](https://aifestug.com)

---

<div align="center">

## 💖 Thank You!

**Your contributions help build Uganda's tech ecosystem infrastructure**

Together, we're mapping Uganda's tech future 🇺🇬

[![Star on GitHub](https://img.shields.io/github/stars/yourusername/tech-atlas-uganda?style=social)](https://github.com/yourusername/tech-atlas-uganda)

**[⬆ Back to Top](#-contributing-to-tech-atlas-uganda)**

</div>
