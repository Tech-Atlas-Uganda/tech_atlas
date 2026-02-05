import { integer, pgEnum, pgTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 */
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: pgEnum("role", ["user", "admin", "moderator", "editor"])("role").default("user").notNull(),
  bio: text("bio"),
  skills: json("skills").$type<string[]>(),
  categories: json("categories").$type<string[]>(),
  location: varchar("location", { length: 255 }),
  website: varchar("website", { length: 500 }),
  github: varchar("github", { length: 255 }),
  twitter: varchar("twitter", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tech hubs and physical spaces
 */
export const hubs = pgTable("hubs", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  focusAreas: json("focusAreas").$type<string[]>(),
  location: varchar("location", { length: 255 }),
  address: text("address"),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  website: varchar("website", { length: 500 }),
  logo: varchar("logo", { length: 500 }),
  verified: boolean("verified").default(false).notNull(),
  status: pgEnum("hub_status", ["pending", "approved", "rejected"])("status").default("pending").notNull(),
  createdBy: integer("createdBy").notNull(),
  approvedBy: integer("approvedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  approvedAt: timestamp("approvedAt"),
});

export type Hub = typeof hubs.$inferSelect;
export type InsertHub = typeof hubs.$inferInsert;

/**
 * Tech communities and groups
 */
export const communities = pgTable("communities", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  focusAreas: json("focusAreas").$type<string[]>(),
  type: varchar("type", { length: 100 }), // e.g., "online", "in-person", "hybrid"
  location: varchar("location", { length: 255 }),
  memberCount: integer("memberCount"),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 500 }),
  slack: varchar("slack", { length: 500 }),
  discord: varchar("discord", { length: 500 }),
  telegram: varchar("telegram", { length: 500 }),
  twitter: varchar("twitter", { length: 255 }),
  logo: varchar("logo", { length: 500 }),
  verified: boolean("verified").default(false).notNull(),
  status: pgEnum("community_status", ["pending", "approved", "rejected"])("status").default("pending").notNull(),
  createdBy: integer("createdBy").notNull(),
  approvedBy: integer("approvedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  approvedAt: timestamp("approvedAt"),
});

export type Community = typeof communities.$inferSelect;
export type InsertCommunity = typeof communities.$inferInsert;

/**
 * Startups and companies
 */
export const startups = pgTable("startups", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  industry: varchar("industry", { length: 100 }),
  focusAreas: json("focusAreas").$type<string[]>(),
  stage: varchar("stage", { length: 100 }), // e.g., "idea", "mvp", "growth", "scale"
  founded: integer("founded"),
  location: varchar("location", { length: 255 }),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  teamSize: integer("teamSize"),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 500 }),
  twitter: varchar("twitter", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  logo: varchar("logo", { length: 500 }),
  verified: boolean("verified").default(false).notNull(),
  status: pgEnum("startup_status", ["pending", "approved", "rejected"])("status").default("pending").notNull(),
  createdBy: integer("createdBy").notNull(),
  approvedBy: integer("approvedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  approvedAt: timestamp("approvedAt"),
});

export type Startup = typeof startups.$inferSelect;
export type InsertStartup = typeof startups.$inferInsert;

/**
 * Job listings (full-time, internships)
 */
export const jobs = pgTable("jobs", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  company: varchar("company", { length: 255 }).notNull(),
  description: text("description"),
  requirements: text("requirements"),
  responsibilities: text("responsibilities"),
  type: pgEnum("job_type", ["full-time", "part-time", "internship", "contract"])("type").notNull(),
  location: varchar("location", { length: 255 }),
  remote: boolean("remote").default(false).notNull(),
  skills: json("skills").$type<string[]>(),
  experienceLevel: varchar("experienceLevel", { length: 100 }), // e.g., "entry", "mid", "senior"
  salaryMin: integer("salaryMin"),
  salaryMax: integer("salaryMax"),
  currency: varchar("currency", { length: 10 }).default("UGX"),
  applicationUrl: varchar("applicationUrl", { length: 500 }),
  applicationEmail: varchar("applicationEmail", { length: 320 }),
  featured: boolean("featured").default(false).notNull(),
  expiresAt: timestamp("expiresAt"),
  status: pgEnum("job_status", ["pending", "approved", "rejected", "expired"])("status").default("pending").notNull(),
  createdBy: integer("createdBy").notNull(),
  approvedBy: integer("approvedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  approvedAt: timestamp("approvedAt"),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

/**
 * Gig listings (freelance, paid help)
 */
export const gigs = pgTable("gigs", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  requirements: text("requirements"),
  category: varchar("category", { length: 100 }), // e.g., "web-dev", "design", "content", "consulting"
  budget: integer("budget"),
  currency: varchar("currency", { length: 10 }).default("UGX"),
  duration: varchar("duration", { length: 100 }), // e.g., "1 week", "1 month"
  skills: json("skills").$type<string[]>(),
  remote: boolean("remote").default(true).notNull(),
  location: varchar("location", { length: 255 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 50 }),
  featured: boolean("featured").default(false).notNull(),
  expiresAt: timestamp("expiresAt"),
  status: pgEnum("gig_status", ["pending", "approved", "rejected", "completed", "expired"])("status").default("pending").notNull(),
  createdBy: integer("createdBy").notNull(),
  approvedBy: integer("approvedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  approvedAt: timestamp("approvedAt"),
});

export type Gig = typeof gigs.$inferSelect;
export type InsertGig = typeof gigs.$inferInsert;

/**
 * Learning resources
 */
export const learningResources = pgTable("learning_resources", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  type: varchar("type", { length: 100 }), // e.g., "course", "tutorial", "guide", "bootcamp", "mentorship"
  category: varchar("category", { length: 100 }), // e.g., "web", "mobile", "ai", "data", "cyber", "hardware", "product"
  level: varchar("level", { length: 50 }), // e.g., "beginner", "intermediate", "advanced"
  url: varchar("url", { length: 500 }),
  provider: varchar("provider", { length: 255 }),
  cost: varchar("cost", { length: 100 }), // e.g., "free", "paid", "$50"
  duration: varchar("duration", { length: 100 }),
  tags: json("tags").$type<string[]>(),
  featured: boolean("featured").default(false).notNull(),
  status: pgEnum("resource_status", ["pending", "approved", "rejected"])("status").default("pending").notNull(),
  createdBy: integer("createdBy").notNull(),
  approvedBy: integer("approvedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  approvedAt: timestamp("approvedAt"),
});

export type LearningResource = typeof learningResources.$inferSelect;
export type InsertLearningResource = typeof learningResources.$inferInsert;

/**
 * Events (meetups, hackathons, workshops)
 */
export const events = pgTable("events", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  type: varchar("type", { length: 100 }), // e.g., "meetup", "hackathon", "workshop", "conference"
  category: varchar("category", { length: 100 }),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  location: varchar("location", { length: 255 }),
  address: text("address"),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  virtual: boolean("virtual").default(false).notNull(),
  meetingUrl: varchar("meetingUrl", { length: 500 }),
  registrationUrl: varchar("registrationUrl", { length: 500 }),
  organizer: varchar("organizer", { length: 255 }),
  organizerEmail: varchar("organizerEmail", { length: 320 }),
  capacity: integer("capacity"),
  tags: json("tags").$type<string[]>(),
  featured: boolean("featured").default(false).notNull(),
  status: pgEnum("event_status", ["pending", "approved", "rejected", "completed"])("status").default("pending").notNull(),
  createdBy: integer("createdBy").notNull(),
  approvedBy: integer("approvedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  approvedAt: timestamp("approvedAt"),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

/**
 * Opportunities (grants, fellowships, scholarships)
 */
export const opportunities = pgTable("opportunities", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  type: varchar("type", { length: 100 }), // e.g., "grant", "fellowship", "scholarship", "cfp"
  provider: varchar("provider", { length: 255 }),
  amount: varchar("amount", { length: 100 }),
  currency: varchar("currency", { length: 10 }),
  eligibility: text("eligibility"),
  applicationUrl: varchar("applicationUrl", { length: 500 }),
  deadline: timestamp("deadline"),
  tags: json("tags").$type<string[]>(),
  featured: boolean("featured").default(false).notNull(),
  status: pgEnum("opportunity_status", ["pending", "approved", "rejected", "expired"])("status").default("pending").notNull(),
  createdBy: integer("createdBy").notNull(),
  approvedBy: integer("approvedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  approvedAt: timestamp("approvedAt"),
});

export type Opportunity = typeof opportunities.$inferSelect;
export type InsertOpportunity = typeof opportunities.$inferInsert;

/**
 * Blog posts
 */
export const blogPosts = pgTable("blog_posts", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: varchar("coverImage", { length: 500 }),
  category: varchar("category", { length: 100 }), // e.g., "community-spotlight", "startup-story", "career-guidance", "policy", "event-recap"
  tags: json("tags").$type<string[]>(),
  authorId: integer("authorId").notNull(),
  featured: boolean("featured").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  status: pgEnum("blog_status", ["draft", "pending", "approved", "rejected", "published"])("status").default("draft").notNull(),
  createdBy: integer("createdBy").notNull(),
  approvedBy: integer("approvedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  approvedAt: timestamp("approvedAt"),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Forum threads for community discussions
 */
export const forumThreads = pgTable("forum_threads", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  content: text("content").notNull(),
  category: pgEnum("thread_category", ["general", "jobs", "events", "help", "showcase", "feedback"])("category").default("general").notNull(),
  authorId: integer("authorId"), // Nullable for anonymous posts
  authorName: varchar("authorName", { length: 255 }), // For anonymous posts
  isPinned: boolean("isPinned").default(false).notNull(),
  isLocked: boolean("isLocked").default(false).notNull(),
  viewCount: integer("viewCount").default(0).notNull(),
  replyCount: integer("replyCount").default(0).notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  downvotes: integer("downvotes").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastActivityAt: timestamp("lastActivityAt").defaultNow().notNull(),
});

export type ForumThread = typeof forumThreads.$inferSelect;
export type InsertForumThread = typeof forumThreads.$inferInsert;

/**
 * Replies to forum threads
 */
export const forumReplies = pgTable("forum_replies", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  threadId: integer("threadId").notNull(),
  content: text("content").notNull(),
  authorId: integer("authorId"), // Nullable for anonymous replies
  authorName: varchar("authorName", { length: 255 }), // For anonymous replies
  parentReplyId: integer("parentReplyId"), // For nested replies
  upvotes: integer("upvotes").default(0).notNull(),
  downvotes: integer("downvotes").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = typeof forumReplies.$inferInsert;

/**
 * Votes on forum threads and replies
 */
export const forumVotes = pgTable("forum_votes", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("userId").notNull(),
  targetType: pgEnum("vote_target", ["thread", "reply"])("targetType").notNull(),
  targetId: integer("targetId").notNull(),
  voteType: pgEnum("vote_type", ["up", "down"])("voteType").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ForumVote = typeof forumVotes.$inferSelect;
export type InsertForumVote = typeof forumVotes.$inferInsert;