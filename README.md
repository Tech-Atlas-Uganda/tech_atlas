<div align="center">

# 🗺️ Tech Atlas Uganda

### *Mapping and Connecting Uganda's Technology Ecosystem*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-aifestug.com-blue?style=for-the-badge)](https://aifestug.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Made in Uganda](https://img.shields.io/badge/Made_in-Uganda_🇺🇬-red?style=for-the-badge)](https://uganda.com)

**[Live Prototype](https://aifestug.com)** • **[Documentation](#documentation)** • **[Contributing](#contributing)** • **[Contact](#contact)**

---

</div>

## 🌟 Overview

Tech Atlas is an **open-source platform** designed to solve a fundamental problem in Uganda's tech ecosystem: **fragmentation**. Information about hubs, communities, startups, jobs, and opportunities is scattered across countless platforms and personal networks. 

**Tech Atlas brings everything together in one place**, making it easier for everyone to discover opportunities, connect with others, and contribute to the growth of Uganda's technology sector.

### 🎯 Vision

Tech Atlas serves as the **definitive, community-owned platform** for Uganda's tech ecosystem. The platform functions as **digital infrastructure** rather than a commercial product, treating ecosystem data as a **public good** that benefits everyone.

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🗺️ **Ecosystem Mapping**
Interactive directory of tech hubs, communities, and startups with location-based mapping. Color-coded markers, automatic geocoding, and detailed profiles.

### 💼 **Jobs & Gigs Marketplace**
Comprehensive listings for full-time jobs, internships, freelance opportunities, and paid tech help with advanced filtering.

### 📚 **Learning Hub**
Curated resources spanning beginner to advanced levels with career roadmaps for Web Dev, Mobile, AI/ML, Data Science, and more.

</td>
<td width="50%">

### 📅 **Events & Opportunities**
Centralized calendar of tech events, meetups, hackathons, grants, fellowships, and scholarships with searchable archive.

### ✍️ **Blog & Knowledge Base**
Community-driven content including startup stories, career guidance, policy insights, and event recaps with Markdown support.

### 👥 **Talent Directory**
Public showcase where users can create profiles highlighting their expertise, skills, and social links with modern profile cards.

</td>
</tr>
</table>

### 🛡️ **Additional Features**
- 💬 **Community Forum** - Threaded discussions with categories, voting, and moderation
- 🔐 **Role-Based Access Control** - Multi-level user roles (Admin, Moderator, Editor, User, Guest)
- 📊 **Admin Dashboard** - Comprehensive panel for content moderation and analytics
- 🌍 **Interactive Map** - Google Maps integration with location-based filtering

---

## 🚀 Technology Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js_22-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express_4-000000?style=for-the-badge&logo=express&logoColor=white)
![tRPC](https://img.shields.io/badge/tRPC_11-2596BE?style=for-the-badge&logo=trpc&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)

### Database & Infrastructure
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Google Maps](https://img.shields.io/badge/Google_Maps-4285F4?style=for-the-badge&logo=google-maps&logoColor=white)

### UI & Design
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-F56565?style=for-the-badge&logo=lucide&logoColor=white)

</div>

### 🛠️ Complete Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS 4, Vite, Wouter (routing) |
| **Backend** | Node.js 22, Express 4, tRPC 11, Zod (validation) |
| **Database** | PostgreSQL, Supabase, Drizzle ORM |
| **UI Components** | shadcn/ui, Framer Motion, Lucide Icons |
| **Authentication** | Supabase Auth, JWT |
| **Storage** | Supabase Storage (avatars, images) |
| **Maps** | Google Maps JavaScript API |
| **Testing** | Vitest |
| **Package Manager** | pnpm |

---

## 🏁 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** 22.x or higher
- **pnpm** package manager
- **PostgreSQL** database (or Supabase account)

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tech-atlas-uganda.git
cd tech-atlas-uganda

# Install dependencies
pnpm install
```

### ⚙️ Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/database

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Frontend Environment Variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Authentication
JWT_SECRET=your-jwt-secret

# Email Configuration (Optional)
RESEND_API_KEY=your-resend-api-key

# Analytics (Optional)
UMAMI_WEBSITE_ID=your-umami-website-id
VITE_UMAMI_WEBSITE_ID=your-umami-website-id
```

### 🗄️ Database Setup

```bash
# Push database schema
pnpm db:push

# Or run migrations
pnpm db:migrate
```

### 🚀 Development

```bash
# Start development server
pnpm dev

# Application will be available at http://localhost:3000
```

### 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### 📦 Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

---

## 📁 Project Structure

```
tech-atlas-uganda/
├── 📂 client/                    # Frontend React application
│   ├── 📂 public/               # Static assets (logo, favicon)
│   └── 📂 src/
│       ├── 📂 components/       # Reusable UI components
│       ├── 📂 pages/            # Page-level components
│       ├── 📂 hooks/            # Custom React hooks
│       ├── 📂 contexts/         # React context providers
│       ├── 📂 lib/              # Utility libraries (tRPC client)
│       ├── 📄 App.tsx           # Routes and layout
│       ├── 📄 main.tsx          # Application entry point
│       └── 📄 index.css         # Global styles
│
├── 📂 server/                    # Backend Express + tRPC server
│   ├── 📂 _core/                # Framework plumbing
│   ├── 📄 db.ts                 # Database query helpers
│   ├── 📄 routers.ts            # tRPC procedure definitions
│   └── 📄 *.test.ts             # Backend tests
│
├── 📂 drizzle/                   # Database schema and migrations
│   ├── 📄 schema-postgres.ts    # PostgreSQL table definitions
│   └── 📄 schema-simple.ts      # Simplified schema
│
├── 📂 shared/                    # Shared types and constants
│   └── 📄 const.ts              # Shared constants
│
├── 📄 package.json              # Dependencies and scripts
├── 📄 vite.config.ts            # Vite configuration
├── 📄 tailwind.config.ts        # Tailwind CSS configuration
└── 📄 drizzle.config.ts         # Drizzle ORM configuration
```

---

## 🤝 Contributing

Tech Atlas is a **community project** and welcomes contributions from developers, designers, content creators, and anyone passionate about Uganda's tech ecosystem.

### How to Contribute

1. **🍴 Fork the repository** and create a feature branch
2. **✏️ Make your changes** following the code style and conventions
3. **🧪 Write tests** for new features or bug fixes
4. **📝 Update documentation** if needed
5. **🚀 Submit a pull request** with a clear description of changes

### Contribution Areas

- 💻 **Code** - Bug fixes, new features, performance improvements
- 🎨 **Design** - UI/UX improvements, graphics, branding
- 📝 **Content** - Blog posts, documentation, tutorials
- 🐛 **Testing** - Bug reports, test coverage, QA
- 🌍 **Translation** - Localization to local languages
- 📊 **Data** - Ecosystem mapping, directory updates

For detailed guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 🏛️ Community Governance

Tech Atlas operates under **transparent community governance** principles. Major decisions are made through open discussion and consensus-building. The platform is maintained by core contributors with support from community moderators.

### Moderators

Community moderators help maintain content quality and adherence to community guidelines. Current moderators are listed on the [Team page](https://aifestug.com/team).

---

## 📄 License

This project is open source and available under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

## 📞 Contact

<div align="center">

### Get in Touch

**🌐 Live Prototype:** [aifestug.com](https://aifestug.com)

**📧 Email:** [ronlinx6@gmail.com](mailto:ronlinx6@gmail.com)

**💬 Inquiries:** For more information, partnerships, or support, reach out via email

---

### Connect With Us

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername/tech-atlas-uganda)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/techatlas_ug)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/company/tech-atlas-uganda)

</div>

---

## 🙏 Acknowledgments

Tech Atlas is built with support from **Uganda's tech community** and powered by **open-source software**. Special thanks to:

- 🌟 All contributors, moderators, and community members
- 💻 Open-source projects that make this possible
- 🇺🇬 Uganda's vibrant tech ecosystem
- 🤝 Partners and supporters who believe in our mission

---

## 🗺️ Roadmap

### Current Features ✅
- Interactive ecosystem mapping
- Jobs & gigs marketplace
- Learning hub with career roadmaps
- Events & opportunities calendar
- Community forum
- Talent directory
- Admin & moderator panel

### Coming Soon 🚀
- Mobile applications (iOS & Android)
- API for third-party integrations
- Advanced analytics dashboard
- Mentorship matching system
- Startup funding tracker
- Tech salary insights
- Newsletter system
- Multi-language support

---

<div align="center">

## 💖 Built with Love for Uganda's Tech Ecosystem

**Tech Atlas Uganda** • Connecting Innovation, One Node at a Time

[![Star on GitHub](https://img.shields.io/github/stars/yourusername/tech-atlas-uganda?style=social)](https://github.com/yourusername/tech-atlas-uganda)
[![Follow on Twitter](https://img.shields.io/twitter/follow/techatlas_ug?style=social)](https://twitter.com/techatlas_ug)

**[⬆ Back to Top](#-tech-atlas-uganda)**

</div>
