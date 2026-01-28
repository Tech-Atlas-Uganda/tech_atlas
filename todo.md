# Tech Atlas - Project TODO

## Database Schema & Backend API
- [x] Design and implement core database schema (hubs, communities, startups, jobs, gigs, learning resources, events, opportunities, blog posts)
- [x] Add approval workflow fields (status, created_by, approved_by, timestamps)
- [x] Implement role-based access control in database (RLS policies)
- [x] Create tRPC routers for all core entities
- [ ] Add full-text search capabilities with PostgreSQL

## Ecosystem Mapping
- [x] Build hub directory with profiles and verification status
- [x] Create community directory with detailed information
- [x] Add startup directory with focus areas and contact info
- [ ] Integrate Mapbox/Leaflet for location-based mapping
- [ ] Implement interactive map with markers and popups
- [x] Add filtering by location, focus area, and verification status

## Jobs & Gigs Marketplace
- [x] Create job listings with full-time and internship categories
- [x] Build gig marketplace for freelance opportunities
- [x] Add paid tech help marketplace
- [x] Implement moderated approval workflow
- [x] Add advanced filtering by skills, location, category, and job type
- [ ] Create job detail pages with application information

## Learning Hub
- [x] Build curated resource directory (beginner to advanced)
- [x] Create career roadmaps for Web, Mobile, AI, Data, Cyber, Hardware, Product
- [x] Add guides and tutorials section
- [x] Implement local bootcamp directory
- [ ] Create mentorship program listings
- [x] Add resource categories and tagging system

## Events & Opportunities Calendar
- [x] Build event calendar with date-based views
- [x] Add event categories (hackathons, meetups, workshops, conferences)
- [x] Create opportunities section (grants, fellowships, scholarships, CFPs)
- [x] Implement filtering by date, category, and location
- [ ] Add past event archive with preservation
- [ ] Create event detail pages with registration links

## Blog & Knowledge Base
- [x] Build blog system with Markdown support
- [x] Add blog categories (community spotlights, startup stories, career guidance, policy insights, event recaps)
- [x] Implement tagging system
- [x] Create featured posts functionality
- [ ] Add author profiles and attribution
- [ ] Build blog post detail pages with related content

## Authentication & Authorization
- [x] Integrate Supabase Auth (email, OAuth, magic link)
- [x] Implement role-based access control (Admin, Moderator, Editor, User, Guest)
- [ ] Add user profile management
- [x] Create protected routes for authenticated users
- [x] Implement row-level security policies

## Admin & Moderator Panel
- [x] Build admin dashboard with analytics
- [x] Create approval/rejection workflows for all content types
- [x] Add content featuring functionality
- [x] Implement edit and delete capabilities for admins
- [ ] Create user moderation tools
- [x] Add analytics dashboard (active submissions, trending content, top hubs)

## Search & Filtering
- [x] Implement basic search functionality
- [x] Add filtering by category, location, skills, tags
- [ ] Implement PostgreSQL full-text search
- [ ] Add global search across all content types
- [ ] Build autocomplete functionality
- [ ] Add search results page with faceted navigation

## Community Governance
- [ ] Create submission guidelines and documentation
- [x] Build transparent moderation system
- [ ] Add dispute resolution workflow
- [ ] Implement public activity tracking
- [ ] Create contribution statistics and leaderboards

## UI/UX & Design
- [x] Design visual style and color palette
- [x] Implement dark/light mode toggle with localStorage persistence
- [ ] Add liquid glass card effects
- [x] Integrate Framer Motion animations
- [x] Build responsive navigation and layout
- [x] Create consistent component library
- [x] Ensure mobile-first responsive design
- [ ] Add accessibility features (WCAG 2.1 compliance)

## Testing & Deployment
- [x] Write vitest tests for critical backend procedures
- [ ] Test all user flows and edge cases
- [ ] Verify role-based access control
- [ ] Test search and filtering functionality
- [ ] Create initial checkpoint for deployment

## Remaining Features
- [ ] Create submission forms for all content types
- [ ] Build detail pages for all content types
- [ ] Add user profile pages
- [ ] Implement notification system
- [ ] Add email notifications for approvals/rejections
- [ ] Create contribution guidelines page
- [ ] Build about page
- [ ] Add privacy policy and terms of service pages

## New Feature Request - Submission Forms
- [x] Create hub submission form with validation
- [ ] Create community submission form
- [ ] Create startup submission form
- [x] Build job posting form with all required fields
- [ ] Build gig posting form
- [x] Create event submission form with date pickers
- [x] Build learning resource submission form
- [x] Create blog post submission form with Markdown editor
- [x] Add form validation and error handling
- [x] Implement success notifications after submission
- [x] Add routing to submission forms from main pages

## New Feature Request - Interactive Mapping
- [x] Integrate Google Maps component into ecosystem page
- [x] Add geocoding for hubs, communities, and startups with location data
- [x] Implement marker clustering for better visualization
- [x] Add custom markers with entity type icons
- [x] Create info windows showing entity details on marker click
- [x] Implement location-based filtering (filter by city/region)
- [x] Add map/list view toggle
- [x] Sync map markers with filtered list results

## New Feature Request - Redesign & Enhancements
- [x] Shift navigation to left sidebar with modern techie design
- [x] Create Uganda tech ecosystem dashboard page
- [x] Integrate GitHub API for repository stats (forks, stars, contributors)
- [x] Fix all submission buttons to navigate to correct forms
- [x] Enhance admin page with profile management for different entity types
- [x] Add smooth animations throughout the platform
- [x] Update color scheme for techie aesthetic
- [x] Add hover effects and micro-interactions
- [x] Implement animated page transitions
