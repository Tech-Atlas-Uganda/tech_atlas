import { eq, and, or, like, desc, asc, sql, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  hubs, InsertHub, Hub,
  communities, InsertCommunity, Community,
  startups, InsertStartup, Startup,
  jobs, InsertJob, Job,
  gigs, InsertGig, Gig,
  learningResources, InsertLearningResource, LearningResource,
  forumThreads, InsertForumThread, ForumThread,
  forumReplies, InsertForumReply, ForumReply,
  forumVotes, InsertForumVote, ForumVote,
  events, InsertEvent, Event,
  opportunities, InsertOpportunity, Opportunity,
  blogPosts, InsertBlogPost, BlogPost
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ===== USER OPERATIONS =====

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "bio", "location", "website", "github", "twitter", "linkedin"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.skills !== undefined) {
      values.skills = user.skills;
      updateSet.skills = user.skills;
    }

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function updateUserProfile(userId: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set(data).where(eq(users.id, userId));
}

// ===== HUB OPERATIONS =====

export async function createHub(data: InsertHub) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(hubs).values(data);
  return result;
}

export async function getHubs(filters?: { status?: string; verified?: boolean; limit?: number }) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(hubs);
  const conditions = [];
  
  if (filters?.status) {
    conditions.push(eq(hubs.status, filters.status as any));
  }
  if (filters?.verified !== undefined) {
    conditions.push(eq(hubs.verified, filters.verified));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  query = query.orderBy(desc(hubs.createdAt)) as any;
  
  if (filters?.limit) {
    query = query.limit(filters.limit) as any;
  }
  
  return await query;
}

export async function getHubBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(hubs).where(eq(hubs.slug, slug)).limit(1);
  return result[0];
}

export async function updateHub(id: number, data: Partial<InsertHub>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(hubs).set(data).where(eq(hubs.id, id));
}

export async function deleteHub(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(hubs).where(eq(hubs.id, id));
}

// ===== COMMUNITY OPERATIONS =====

export async function createCommunity(data: InsertCommunity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(communities).values(data);
  return result;
}

export async function getCommunities(filters?: { status?: string; limit?: number }) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(communities);
  
  if (filters?.status) {
    query = query.where(eq(communities.status, filters.status as any)) as any;
  }
  
  query = query.orderBy(desc(communities.createdAt)) as any;
  
  if (filters?.limit) {
    query = query.limit(filters.limit) as any;
  }
  
  return await query;
}

export async function getCommunityBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(communities).where(eq(communities.slug, slug)).limit(1);
  return result[0];
}

export async function updateCommunity(id: number, data: Partial<InsertCommunity>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(communities).set(data).where(eq(communities.id, id));
}

export async function deleteCommunity(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(communities).where(eq(communities.id, id));
}

// ===== STARTUP OPERATIONS =====

export async function createStartup(data: InsertStartup) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(startups).values(data);
  return result;
}

export async function getStartups(filters?: { status?: string; limit?: number }) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(startups);
  
  if (filters?.status) {
    query = query.where(eq(startups.status, filters.status as any)) as any;
  }
  
  query = query.orderBy(desc(startups.createdAt)) as any;
  
  if (filters?.limit) {
    query = query.limit(filters.limit) as any;
  }
  
  return await query;
}

export async function getStartupBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(startups).where(eq(startups.slug, slug)).limit(1);
  return result[0];
}

export async function updateStartup(id: number, data: Partial<InsertStartup>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(startups).set(data).where(eq(startups.id, id));
}

export async function deleteStartup(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(startups).where(eq(startups.id, id));
}

// ===== JOB OPERATIONS =====

export async function createJob(data: InsertJob) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(jobs).values(data);
  return result;
}

export async function getJobs(filters?: { status?: string; type?: string; remote?: boolean; limit?: number }) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(jobs);
  const conditions = [];
  
  if (filters?.status) {
    conditions.push(eq(jobs.status, filters.status as any));
  }
  if (filters?.type) {
    conditions.push(eq(jobs.type, filters.type as any));
  }
  if (filters?.remote !== undefined) {
    conditions.push(eq(jobs.remote, filters.remote));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  query = query.orderBy(desc(jobs.createdAt)) as any;
  
  if (filters?.limit) {
    query = query.limit(filters.limit) as any;
  }
  
  return await query;
}

export async function getJobBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(jobs).where(eq(jobs.slug, slug)).limit(1);
  return result[0];
}

export async function updateJob(id: number, data: Partial<InsertJob>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(jobs).set(data).where(eq(jobs.id, id));
}

export async function deleteJob(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(jobs).where(eq(jobs.id, id));
}

// ===== GIG OPERATIONS =====

export async function createGig(data: InsertGig) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(gigs).values(data);
  return result;
}

export async function getGigs(filters?: { status?: string; category?: string; limit?: number }) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(gigs);
  const conditions = [];
  
  if (filters?.status) {
    conditions.push(eq(gigs.status, filters.status as any));
  }
  if (filters?.category) {
    conditions.push(eq(gigs.category, filters.category));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  query = query.orderBy(desc(gigs.createdAt)) as any;
  
  if (filters?.limit) {
    query = query.limit(filters.limit) as any;
  }
  
  return await query;
}

export async function getGigBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(gigs).where(eq(gigs.slug, slug)).limit(1);
  return result[0];
}

export async function updateGig(id: number, data: Partial<InsertGig>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(gigs).set(data).where(eq(gigs.id, id));
}

export async function deleteGig(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(gigs).where(eq(gigs.id, id));
}

// ===== LEARNING RESOURCE OPERATIONS =====

export async function createLearningResource(data: InsertLearningResource) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(learningResources).values(data);
  return result;
}

export async function getLearningResources(filters?: { status?: string; category?: string; level?: string; limit?: number }) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(learningResources);
  const conditions = [];
  
  if (filters?.status) {
    conditions.push(eq(learningResources.status, filters.status as any));
  }
  if (filters?.category) {
    conditions.push(eq(learningResources.category, filters.category));
  }
  if (filters?.level) {
    conditions.push(eq(learningResources.level, filters.level));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  query = query.orderBy(desc(learningResources.createdAt)) as any;
  
  if (filters?.limit) {
    query = query.limit(filters.limit) as any;
  }
  
  return await query;
}

export async function getLearningResourceBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(learningResources).where(eq(learningResources.slug, slug)).limit(1);
  return result[0];
}

export async function updateLearningResource(id: number, data: Partial<InsertLearningResource>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(learningResources).set(data).where(eq(learningResources.id, id));
}

export async function deleteLearningResource(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(learningResources).where(eq(learningResources.id, id));
}

// ===== EVENT OPERATIONS =====

export async function createEvent(data: InsertEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(events).values(data);
  return result;
}

export async function getEvents(filters?: { status?: string; type?: string; upcoming?: boolean; limit?: number }) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(events);
  const conditions = [];
  
  if (filters?.status) {
    conditions.push(eq(events.status, filters.status as any));
  }
  if (filters?.type) {
    conditions.push(eq(events.type, filters.type));
  }
  if (filters?.upcoming) {
    conditions.push(gte(events.startDate, new Date()));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  query = query.orderBy(desc(events.startDate)) as any;
  
  if (filters?.limit) {
    query = query.limit(filters.limit) as any;
  }
  
  return await query;
}

export async function getEventBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
  return result[0];
}

export async function updateEvent(id: number, data: Partial<InsertEvent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(events).set(data).where(eq(events.id, id));
}

export async function deleteEvent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(events).where(eq(events.id, id));
}

// ===== OPPORTUNITY OPERATIONS =====

export async function createOpportunity(data: InsertOpportunity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(opportunities).values(data);
  return result;
}

export async function getOpportunities(filters?: { status?: string; type?: string; limit?: number }) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(opportunities);
  const conditions = [];
  
  if (filters?.status) {
    conditions.push(eq(opportunities.status, filters.status as any));
  }
  if (filters?.type) {
    conditions.push(eq(opportunities.type, filters.type));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  query = query.orderBy(desc(opportunities.createdAt)) as any;
  
  if (filters?.limit) {
    query = query.limit(filters.limit) as any;
  }
  
  return await query;
}

export async function getOpportunityBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(opportunities).where(eq(opportunities.slug, slug)).limit(1);
  return result[0];
}

export async function updateOpportunity(id: number, data: Partial<InsertOpportunity>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(opportunities).set(data).where(eq(opportunities.id, id));
}

export async function deleteOpportunity(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(opportunities).where(eq(opportunities.id, id));
}

// ===== BLOG POST OPERATIONS =====

export async function createBlogPost(data: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blogPosts).values(data);
  return result;
}

export async function getBlogPosts(filters?: { status?: string; category?: string; authorId?: number; featured?: boolean; limit?: number }) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(blogPosts);
  const conditions = [];
  
  if (filters?.status) {
    conditions.push(eq(blogPosts.status, filters.status as any));
  }
  if (filters?.category) {
    conditions.push(eq(blogPosts.category, filters.category));
  }
  if (filters?.authorId) {
    conditions.push(eq(blogPosts.authorId, filters.authorId));
  }
  if (filters?.featured !== undefined) {
    conditions.push(eq(blogPosts.featured, filters.featured));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  query = query.orderBy(desc(blogPosts.publishedAt)) as any;
  
  if (filters?.limit) {
    query = query.limit(filters.limit) as any;
  }
  
  return await query;
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result[0];
}

export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

// ===== ADMIN & MODERATION HELPERS =====

export async function getPendingContent() {
  const db = await getDb();
  if (!db) return { hubs: [], communities: [], startups: [], jobs: [], gigs: [], learningResources: [], events: [], opportunities: [], blogPosts: [] };
  
  const [pendingHubs, pendingCommunities, pendingStartups, pendingJobs, pendingGigs, pendingResources, pendingEvents, pendingOpportunities, pendingBlogPosts] = await Promise.all([
    db.select().from(hubs).where(eq(hubs.status, 'pending')).orderBy(desc(hubs.createdAt)),
    db.select().from(communities).where(eq(communities.status, 'pending')).orderBy(desc(communities.createdAt)),
    db.select().from(startups).where(eq(startups.status, 'pending')).orderBy(desc(startups.createdAt)),
    db.select().from(jobs).where(eq(jobs.status, 'pending')).orderBy(desc(jobs.createdAt)),
    db.select().from(gigs).where(eq(gigs.status, 'pending')).orderBy(desc(gigs.createdAt)),
    db.select().from(learningResources).where(eq(learningResources.status, 'pending')).orderBy(desc(learningResources.createdAt)),
    db.select().from(events).where(eq(events.status, 'pending')).orderBy(desc(events.createdAt)),
    db.select().from(opportunities).where(eq(opportunities.status, 'pending')).orderBy(desc(opportunities.createdAt)),
    db.select().from(blogPosts).where(eq(blogPosts.status, 'pending')).orderBy(desc(blogPosts.createdAt)),
  ]);
  
  return {
    hubs: pendingHubs,
    communities: pendingCommunities,
    startups: pendingStartups,
    jobs: pendingJobs,
    gigs: pendingGigs,
    learningResources: pendingResources,
    events: pendingEvents,
    opportunities: pendingOpportunities,
    blogPosts: pendingBlogPosts,
  };
}

export async function getContentStats() {
  const db = await getDb();
  if (!db) return null;
  
  const [hubsCount, communitiesCount, startupsCount, jobsCount, gigsCount, resourcesCount, eventsCount, opportunitiesCount, blogPostsCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(hubs).where(eq(hubs.status, 'approved')),
    db.select({ count: sql<number>`count(*)` }).from(communities).where(eq(communities.status, 'approved')),
    db.select({ count: sql<number>`count(*)` }).from(startups).where(eq(startups.status, 'approved')),
    db.select({ count: sql<number>`count(*)` }).from(jobs).where(eq(jobs.status, 'approved')),
    db.select({ count: sql<number>`count(*)` }).from(gigs).where(eq(gigs.status, 'approved')),
    db.select({ count: sql<number>`count(*)` }).from(learningResources).where(eq(learningResources.status, 'approved')),
    db.select({ count: sql<number>`count(*)` }).from(events).where(eq(events.status, 'approved')),
    db.select({ count: sql<number>`count(*)` }).from(opportunities).where(eq(opportunities.status, 'approved')),
    db.select({ count: sql<number>`count(*)` }).from(blogPosts).where(eq(blogPosts.status, 'published')),
  ]);
  
  return {
    hubs: hubsCount[0]?.count || 0,
    communities: communitiesCount[0]?.count || 0,
    startups: startupsCount[0]?.count || 0,
    jobs: jobsCount[0]?.count || 0,
    gigs: gigsCount[0]?.count || 0,
    learningResources: resourcesCount[0]?.count || 0,
    events: eventsCount[0]?.count || 0,
    opportunities: opportunitiesCount[0]?.count || 0,
    blogPosts: blogPostsCount[0]?.count || 0,
  };
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(users);
  return result;
}



// ===== Forum Functions =====

export async function getAllForumThreads(category?: string) {
  const db = await getDb();
  if (!db) return [];

  if (category) {
    const result = await db.select().from(forumThreads)
      .where(eq(forumThreads.category, category as any))
      .orderBy(desc(forumThreads.lastActivityAt));
    return result;
  }
  
  const result = await db.select().from(forumThreads).orderBy(desc(forumThreads.lastActivityAt));
  return result;
}

export async function getForumThreadBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(forumThreads).where(eq(forumThreads.slug, slug)).limit(1);
  return result[0];
}

export async function createForumThread(thread: InsertForumThread) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(forumThreads).values(thread);
  return getForumThreadBySlug(thread.slug);
}

export async function updateForumThread(id: number, updates: Partial<InsertForumThread>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(forumThreads).set(updates).where(eq(forumThreads.id, id));
  return { success: true };
}

export async function deleteForumThread(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(forumThreads).where(eq(forumThreads.id, id));
  return { success: true };
}

export async function getForumRepliesByThreadId(threadId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select().from(forumReplies).where(eq(forumReplies.threadId, threadId)).orderBy(asc(forumReplies.createdAt));
  return result;
}

export async function createForumReply(reply: InsertForumReply) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(forumReplies).values(reply);
  
  // Update thread reply count and last activity
  await db.update(forumThreads)
    .set({ 
      replyCount: sql`${forumThreads.replyCount} + 1`,
      lastActivityAt: new Date()
    })
    .where(eq(forumThreads.id, reply.threadId));
  
  const result = await db.select().from(forumReplies).where(eq(forumReplies.threadId, reply.threadId)).orderBy(desc(forumReplies.id)).limit(1);
  return result[0];
}

export async function voteOnForumContent(vote: InsertForumVote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if user already voted
  const existing = await db.select().from(forumVotes)
    .where(
      and(
        eq(forumVotes.userId, vote.userId),
        eq(forumVotes.targetType, vote.targetType),
        eq(forumVotes.targetId, vote.targetId)
      )
    ).limit(1);

  if (existing.length > 0) {
    // Update existing vote
    await db.update(forumVotes).set({ voteType: vote.voteType }).where(eq(forumVotes.id, existing[0].id));
  } else {
    // Create new vote
    await db.insert(forumVotes).values(vote);
  }

  // Update vote counts
  const votes = await db.select().from(forumVotes)
    .where(
      and(
        eq(forumVotes.targetType, vote.targetType),
        eq(forumVotes.targetId, vote.targetId)
      )
    );

  const upvotes = votes.filter(v => v.voteType === "up").length;
  const downvotes = votes.filter(v => v.voteType === "down").length;

  if (vote.targetType === "thread") {
    await db.update(forumThreads).set({ upvotes, downvotes }).where(eq(forumThreads.id, vote.targetId));
  } else {
    await db.update(forumReplies).set({ upvotes, downvotes }).where(eq(forumReplies.id, vote.targetId));
  }

  return { success: true, upvotes, downvotes };
}
