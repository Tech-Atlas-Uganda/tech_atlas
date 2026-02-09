# 📁 Tech Atlas Project Structure

## Root Directory Organization

```
tech-atlas-uganda/
├── 📄 README.md                    # Main project documentation
├── 📄 CONTRIBUTING.md              # Contribution guidelines
├── 📄 LICENSE                      # MIT License
├── 📄 PROJECT_STRUCTURE.md         # This file
│
├── 📂 client/                      # Frontend React application
│   ├── 📂 public/                 # Static assets
│   └── 📂 src/                    # Source code
│       ├── 📂 components/         # Reusable UI components
│       ├── 📂 pages/              # Page components
│       ├── 📂 hooks/              # Custom React hooks
│       ├── 📂 contexts/           # React contexts
│       ├── 📂 lib/                # Utility libraries
│       ├── 📄 App.tsx             # Main app component
│       └── 📄 main.tsx            # Entry point
│
├── 📂 server/                      # Backend Express + tRPC
│   ├── 📂 _core/                  # Core server utilities
│   ├── 📄 db.ts                   # Database queries
│   ├── 📄 routers.ts              # tRPC routers
│   └── 📄 *.test.ts               # Backend tests
│
├── 📂 drizzle/                     # Database schema
│   ├── 📄 schema-postgres.ts      # PostgreSQL schema
│   └── 📄 schema-simple.ts        # Simplified schema
│
├── 📂 shared/                      # Shared code
│   └── 📄 const.ts                # Shared constants
│
├── 📂 docs/                        # 📚 All documentation
│   ├── 📄 README.md               # Documentation index
│   ├── 📄 LOCAL_SETUP.md          # Local setup guide
│   ├── 📄 SUPABASE_SETUP.md       # Supabase configuration
│   ├── 📄 PROFILE_SYSTEM_SETUP.md # Profile system docs
│   └── 📄 ... (30+ documentation files)
│
├── 📂 sql/                         # 🗄️ SQL scripts
│   ├── 📄 README.md               # SQL scripts index
│   ├── 📄 supabase-setup.sql      # Database setup
│   ├── 📄 add-user-profile-fields.sql
│   └── 📄 ... (migration scripts)
│
├── 📂 scripts/                     # Build & utility scripts
├── 📂 patches/                     # Package patches
│
├── 📄 package.json                 # Dependencies
├── 📄 pnpm-lock.yaml              # Lock file
├── 📄 tsconfig.json               # TypeScript config
├── 📄 vite.config.ts              # Vite config
├── 📄 vitest.config.ts            # Test config
├── 📄 tailwind.config.ts          # Tailwind config
├── 📄 drizzle.config.ts           # Drizzle ORM config
├── 📄 components.json             # shadcn/ui config
├── 📄 .env                        # Environment variables
├── 📄 .gitignore                  # Git ignore rules
└── 📄 .prettierrc                 # Prettier config
```

## 📚 Documentation Organization

All documentation has been moved to the `docs/` folder for better organization:

### What's in Root
- ✅ `README.md` - Main project documentation
- ✅ `CONTRIBUTING.md` - How to contribute
- ✅ `LICENSE` - MIT License
- ✅ `PROJECT_STRUCTURE.md` - This file

### What's in docs/
- 📖 Setup guides (local, database, Supabase)
- 🔧 Feature documentation (profiles, images, maps)
- 🐛 Troubleshooting guides
- 🚀 Deployment guides
- 📋 Project management docs

**See [docs/README.md](docs/README.md) for complete documentation index**

## 🗄️ SQL Scripts Organization

All SQL scripts have been moved to the `sql/` folder:

- 📝 Database setup scripts
- 🔄 Migration scripts
- 🔐 Governance & roles setup
- 🐛 Debug scripts

**See [sql/README.md](sql/README.md) for SQL scripts index**

## 🎯 Quick Navigation

### For Developers
- **Getting Started** → [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md)
- **Database Setup** → [docs/QUICK_DATABASE_SETUP.md](docs/QUICK_DATABASE_SETUP.md)
- **Contributing** → [CONTRIBUTING.md](CONTRIBUTING.md)

### For Users
- **Live Demo** → [aifestug.com](https://aifestug.com)
- **Main README** → [README.md](README.md)
- **Contact** → ronlinx6@gmail.com

### For Troubleshooting
- **Quick Fixes** → [docs/QUICK_FIX_GUIDE.md](docs/QUICK_FIX_GUIDE.md)
- **Avatar Upload Issues** → [docs/AVATAR_UPLOAD_TROUBLESHOOTING.md](docs/AVATAR_UPLOAD_TROUBLESHOOTING.md)
- **Database Issues** → [docs/SETUP_DATABASE.md](docs/SETUP_DATABASE.md)

## 📦 Key Files

| File | Purpose |
|------|---------|
| `package.json` | Project dependencies and scripts |
| `vite.config.ts` | Vite bundler configuration |
| `tsconfig.json` | TypeScript compiler options |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `drizzle.config.ts` | Database ORM configuration |
| `.env` | Environment variables (not in git) |

## 🚀 npm Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio

# Testing
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode

# Code Quality
pnpm lint             # Lint code
pnpm format           # Format code with Prettier
```

## 🔍 Finding Things

### Looking for...
- **Setup instructions?** → `docs/LOCAL_SETUP.md`
- **SQL scripts?** → `sql/` folder
- **Component code?** → `client/src/components/`
- **API routes?** → `server/routers.ts`
- **Database schema?** → `drizzle/schema-postgres.ts`
- **Environment variables?** → `.env` (create from `.env.example`)

## 📞 Need Help?

- 📧 Email: ronlinx6@gmail.com
- 🌐 Live Demo: [aifestug.com](https://aifestug.com)
- 📖 Documentation: [docs/README.md](docs/README.md)
- 🐛 Issues: GitHub Issues (coming soon)

---

**Last Updated:** December 2024
