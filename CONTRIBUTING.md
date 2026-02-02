# Contributing to Tech Atlas

Thank you for your interest in contributing to Tech Atlas. This document provides comprehensive guidelines for contributing to the platform, whether through code, content, design, or community engagement. Tech Atlas is a community-owned project, and contributions from individuals at all skill levels are welcome and valued.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Ways to Contribute](#ways-to-contribute)
3. [Getting Started](#getting-started)
4. [Development Workflow](#development-workflow)
5. [Code Guidelines](#code-guidelines)
6. [Content Guidelines](#content-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Community Guidelines](#community-guidelines)

## Code of Conduct

Tech Atlas is committed to providing a welcoming and inclusive environment for all contributors. All participants are expected to adhere to the [Code of Conduct](./client/src/pages/CodeOfConduct.tsx). Harassment, discrimination, or disrespectful behavior will not be tolerated. Contributors who violate the Code of Conduct may be temporarily or permanently banned from the project.

## Ways to Contribute

Contributions to Tech Atlas take many forms beyond writing code. The platform benefits from diverse skills and perspectives.

### Code Contributions

Developers can contribute by implementing new features, fixing bugs, improving performance, or enhancing the user interface. The codebase uses TypeScript, React, and tRPC, with opportunities for both frontend and backend development.

### Content Contributions

Content creators can submit ecosystem data including tech hubs, communities, startups, job listings, events, learning resources, and blog posts. All submissions go through a moderation process to ensure quality and accuracy.

### Design Contributions

Designers can contribute UI/UX improvements, create visual assets, design marketing materials, or propose interface enhancements that improve usability and accessibility.

### Documentation Contributions

Technical writers can improve documentation, create tutorials, write guides for new users, or translate content to make the platform more accessible.

### Community Moderation

Experienced community members can apply to become moderators, helping review submissions, moderate forum discussions, and maintain content quality.

## Getting Started

### Prerequisites

Before contributing code, ensure your development environment meets these requirements:

- **Node.js** 22.x or higher
- **pnpm** package manager (install via `npm install -g pnpm`)
- **Git** for version control
- **MySQL or TiDB** database instance for local development
- **Code editor** with TypeScript support (VS Code recommended)

### Fork and Clone

Create a personal fork of the Tech Atlas repository:

1. Navigate to [https://github.com/yourusername/tech-atlas](https://github.com/yourusername/tech-atlas)
2. Click the "Fork" button in the top-right corner
3. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/tech-atlas.git
cd tech-atlas
```

### Install Dependencies

Install all project dependencies using pnpm:

```bash
pnpm install
```

### Set Up Database

Create a local MySQL database and configure the connection string in your environment variables. Then push the schema:

```bash
pnpm db:push
```

### Start Development Server

Launch the development server with hot module replacement:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Development Workflow

### Creating a Feature Branch

Always create a new branch for your work. Use descriptive branch names that reflect the feature or fix:

```bash
git checkout -b feature/add-startup-filtering
git checkout -b fix/forum-reply-bug
git checkout -b docs/update-readme
```

### Making Changes

Make your changes following the code guidelines outlined below. Commit frequently with clear, descriptive commit messages:

```bash
git add .
git commit -m "Add filtering by focus area to startup directory"
```

### Writing Tests

All new features and bug fixes should include tests. Tech Atlas uses Vitest for testing. Create test files alongside the code they test:

```bash
# Example test file
server/forum.test.ts
```

Run tests to ensure your changes do not break existing functionality:

```bash
pnpm test
```

### Keeping Your Fork Updated

Regularly sync your fork with the upstream repository to avoid merge conflicts:

```bash
git remote add upstream https://github.com/yourusername/tech-atlas.git
git fetch upstream
git checkout main
git merge upstream/main
```

## Code Guidelines

### TypeScript Standards

Tech Atlas uses TypeScript for type safety. All code must pass TypeScript compilation without errors:

```bash
pnpm check
```

Follow these TypeScript best practices:

- Define explicit types for function parameters and return values
- Use interfaces for object shapes
- Avoid `any` type; use `unknown` when type is uncertain
- Leverage type inference where appropriate

### React Component Guidelines

React components should be functional components using hooks. Follow these conventions:

- Use named exports for components
- Extract complex logic into custom hooks
- Keep components focused on a single responsibility
- Use TypeScript interfaces for props

Example component structure:

```typescript
interface ProfileCardProps {
  name: string;
  role: string;
  bio: string;
}

export function ProfileCard({ name, role, bio }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{role}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{bio}</p>
      </CardContent>
    </Card>
  );
}
```

### Styling Guidelines

Tech Atlas uses Tailwind CSS for styling. Follow these conventions:

- Use Tailwind utility classes instead of custom CSS when possible
- Extract repeated patterns into reusable components
- Use design tokens defined in `index.css` for colors and spacing
- Ensure responsive design with mobile-first approach

### Backend Development

Backend code uses tRPC for type-safe API procedures. Follow these patterns:

- Define procedures in `server/routers.ts`
- Create database helpers in `server/db.ts`
- Use `publicProcedure` for unauthenticated endpoints
- Use `protectedProcedure` for authenticated endpoints
- Use `adminProcedure` for admin-only endpoints

Example procedure:

```typescript
getHubs: publicProcedure
  .input(z.object({ 
    location: z.string().optional() 
  }))
  .query(async ({ input }) => {
    return await db.getHubsByLocation(input.location);
  }),
```

### Database Schema

Database schema is defined in `drizzle/schema.ts`. When adding new tables or columns:

1. Update the schema file
2. Run `pnpm db:push` to generate and apply migrations
3. Update corresponding TypeScript types
4. Create database helper functions in `server/db.ts`

## Content Guidelines

### Submitting Ecosystem Data

When submitting hubs, communities, startups, or other ecosystem entities:

- Provide accurate, verifiable information
- Include contact details and website links
- Write clear, professional descriptions
- Specify location information for mapping
- Indicate focus areas and specializations

### Job and Opportunity Listings

Job postings should include:

- Clear job title and description
- Required skills and qualifications
- Employment type (full-time, part-time, contract, internship)
- Location (on-site, remote, hybrid)
- Application instructions and deadline
- Company or organization details

### Blog Posts and Articles

Blog contributions should:

- Provide value to the tech community
- Include proper attribution for external sources
- Use Markdown formatting for readability
- Add relevant tags and categories
- Maintain a professional, respectful tone

## Pull Request Process

### Before Submitting

Ensure your pull request meets these criteria:

1. All tests pass (`pnpm test`)
2. TypeScript compiles without errors (`pnpm check`)
3. Code follows style guidelines
4. Commit messages are clear and descriptive
5. Branch is up to date with main

### Submitting a Pull Request

1. Push your branch to your fork:

```bash
git push origin feature/your-feature-name
```

2. Navigate to the original Tech Atlas repository
3. Click "New Pull Request"
4. Select your fork and branch
5. Fill out the pull request template with:
   - Description of changes
   - Related issue numbers (if applicable)
   - Testing performed
   - Screenshots (for UI changes)

### Pull Request Review

Core maintainers will review your pull request. The review process may include:

- Code quality assessment
- Functionality testing
- Design review (for UI changes)
- Documentation verification
- Security considerations

Be prepared to make revisions based on feedback. Engage constructively with reviewers and address all comments before the pull request can be merged.

### After Merge

Once your pull request is merged:

1. Delete your feature branch
2. Sync your fork with upstream
3. Celebrate your contribution to Tech Atlas!

## Community Guidelines

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests, technical discussions
- **GitHub Discussions**: General questions, ideas, community conversations
- **Forum**: Community discussions, help requests, showcasing projects
- **Email**: hello@techatlas.ug for private inquiries

### Reporting Issues

When reporting bugs or issues:

1. Search existing issues to avoid duplicates
2. Use the issue template
3. Provide clear reproduction steps
4. Include relevant error messages and screenshots
5. Specify your environment (browser, OS, Node version)

### Suggesting Features

Feature requests should:

1. Clearly describe the problem being solved
2. Explain the proposed solution
3. Consider alternative approaches
4. Discuss potential impact on existing features
5. Be open to feedback and iteration

### Respectful Collaboration

Tech Atlas thrives on respectful, constructive collaboration. Contributors should:

- Assume good intent in all interactions
- Provide constructive feedback
- Accept criticism gracefully
- Credit others for their work
- Help newcomers get started
- Celebrate community achievements

## Recognition

All contributors are recognized in the project. Significant contributions may lead to:

- Listing on the Team page
- Invitation to become a moderator
- Participation in governance discussions
- Speaking opportunities at community events

## Questions?

If you have questions about contributing, reach out through:

- GitHub Discussions for public questions
- Email hello@techatlas.ug for private inquiries
- Forum for community support

Thank you for contributing to Tech Atlas and helping build Uganda's tech ecosystem infrastructure!

---

**Together, we're mapping Uganda's tech future.**
