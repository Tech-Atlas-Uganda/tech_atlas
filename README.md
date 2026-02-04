# Tech Atlas

**Mapping and connecting Uganda's technology ecosystem**

Tech Atlas is an open-source platform designed to solve a fundamental problem in Uganda's tech ecosystem: fragmentation. Information about hubs, communities, startups, jobs, and opportunities is scattered across countless platforms and personal networks. Tech Atlas brings everything together in one place, making it easier for everyone to discover opportunities, connect with others, and contribute to the growth of Uganda's technology sector.

## Vision

Tech Atlas serves as the definitive, community-owned platform for Uganda's tech ecosystem. The platform functions as digital infrastructure rather than a commercial product, treating ecosystem data as a public good that benefits everyone. Through transparent governance, open-source development, and community ownership, Tech Atlas aims to become the single source of truth for anyone seeking to understand, participate in, or contribute to Uganda's technology landscape.

## Features

### Ecosystem Mapping
Interactive directory of tech hubs, communities, and startups with location-based mapping powered by Google Maps. Each entry includes detailed profiles with descriptions, focus areas, contact information, and verification status. The integrated map view visualizes entities with color-coded markers, automatic geocoding, and location-based filtering.

### Jobs & Gigs Marketplace
Comprehensive listings for full-time jobs, internships, freelance opportunities, and paid tech help. All listings go through a moderated approval workflow with advanced filtering by skills, location, category, and employment type.

### Learning Hub
Curated resources spanning beginner to advanced levels, featuring career roadmaps for Web Development, Mobile Development, AI/ML, Data Science, Cybersecurity, Hardware, and Product Management. Includes guides, tutorials, local bootcamps, and mentorship programs.

### Events & Opportunities Calendar
Centralized searchable archive of tech events, meetups, hackathons, grants, fellowships, scholarships, and calls for speakers. Features filtering capabilities and preservation of past events for historical reference.

### Blog & Knowledge Base
Community-driven content including startup stories, career guidance, policy insights, and event recaps. Supports Markdown formatting, tags, categories, and featured posts for enhanced discoverability.

### Talent Directory
Public showcase where authenticated users can create profiles highlighting their expertise, skills, and social links. Features modern profile cards with GitHub, LinkedIn, Twitter, and portfolio integration.

### Community Forum
Discussion board supporting both authenticated and anonymous participation. Features threaded conversations, categories (General, Jobs, Events, Help, Showcase, Feedback), upvoting/downvoting, and moderation tools.

### Role-Based Access Control
Multi-level user roles including Admin, Moderator, Editor, User, and Guest. Powered by authentication integration with approval workflows and row-level security for content moderation.

### Admin & Moderator Panel
Comprehensive dashboard for approving or rejecting submissions, featuring content, editing or deleting posts, moderating users, managing moderators, and viewing analytics on active submissions and trending content.

## Technology Stack

Tech Atlas is built with modern web technologies optimized for performance, scalability, and developer experience.

### Frontend
- **React 19** with TypeScript for type-safe component development
- **Tailwind CSS 4** for utility-first styling with custom design tokens
- **Framer Motion** for smooth animations and transitions
- **shadcn/ui** component library for consistent, accessible UI elements
- **Wouter** for lightweight client-side routing
- **tRPC** for end-to-end type-safe API communication

### Backend
- **Node.js 22** with Express 4 for server runtime
- **tRPC 11** for type-safe API procedures
- **Drizzle ORM** for database operations with MySQL/TiDB
- **Zod** for runtime validation and schema definition
- **SuperJSON** for seamless serialization of complex types

### Database
- **MySQL/TiDB** for relational data storage
- **Drizzle Kit** for schema migrations

### Infrastructure
- **Vite** for fast development and optimized production builds
- **Vitest** for unit and integration testing
- **Google Maps JavaScript API** for interactive mapping
- **Custom authentication** system

## Getting Started

### Prerequisites

Ensure the following are installed on your system:

- Node.js 22.x or higher
- pnpm package manager
- MySQL or TiDB database instance

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/tech-atlas.git
cd tech-atlas
pnpm install
```

### Configuration

For local development, create a `.env` file with the following:

```env
DATABASE_URL=mysql://user:password@localhost:3306/techatlas
JWT_SECRET=your-jwt-secret
```

### Database Setup

Push the database schema to your MySQL instance:

```bash
pnpm db:push
```

This command generates migrations from `drizzle/schema.ts` and applies them to the database.

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000` with hot module replacement enabled.

### Testing

Run the test suite:

```bash
pnpm test
```

Tests are written using Vitest and cover critical backend procedures and business logic.

### Production Build

Build the application for production:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

## Project Structure

```
tech_atlas/
├── client/                 # Frontend React application
│   ├── public/            # Static assets (logo, favicon)
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page-level components
│       ├── hooks/         # Custom React hooks
│       ├── contexts/      # React context providers
│       ├── lib/           # Utility libraries (tRPC client)
│       ├── App.tsx        # Routes and layout
│       ├── main.tsx       # Application entry point
│       └── index.css      # Global styles and design tokens
├── server/                # Backend Express + tRPC server
│   ├── _core/             # Framework plumbing (OAuth, context)
│   ├── db.ts              # Database query helpers
│   ├── routers.ts         # tRPC procedure definitions
│   └── *.test.ts          # Backend tests
├── drizzle/               # Database schema and migrations
│   └── schema.ts          # Table definitions
├── shared/                # Shared types and constants
└── package.json           # Dependencies and scripts
```

## Contributing

Tech Atlas is a community project and welcomes contributions from developers, designers, content creators, and anyone passionate about Uganda's tech ecosystem. Please read the [CONTRIBUTING.md](./CONTRIBUTING.md) file for detailed guidelines on how to contribute.

### Quick Contribution Guide

1. **Fork the repository** and create a feature branch
2. **Make your changes** following the code style and conventions
3. **Write tests** for new features or bug fixes
4. **Submit a pull request** with a clear description of changes

## Community Governance

Tech Atlas operates under transparent community governance principles. Major decisions are made through open discussion and consensus-building. The platform is maintained by core contributors with support from community moderators who help ensure content quality and adherence to community guidelines.

### Moderators

Community moderators play a vital role in maintaining the integrity and quality of Tech Atlas. Current moderators are listed on the [Team page](https://techatlas.ug/team) and can be contacted for content disputes or community issues.

## License

This project is open source and available under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Support

If you believe in the mission of Tech Atlas and want to support the project, visit the [Support page](https://techatlas.ug/support) to learn about sponsorship opportunities and ways to contribute.

## Contact

- **Website**: [https://techatlas.ug](https://techatlas.ug)
- **Email**: hello@techatlas.ug
- **GitHub**: [https://github.com/yourusername/tech-atlas](https://github.com/yourusername/tech-atlas)

## Acknowledgments

Tech Atlas is built with support from Uganda's tech community and powered by open-source software. Special thanks to all contributors, moderators, and community members who make this platform possible.

---

**Built with ❤️ for Uganda's Tech Ecosystem**
