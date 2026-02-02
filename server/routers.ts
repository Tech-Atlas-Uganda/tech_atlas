import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

// Helper to generate URL-friendly slugs
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin' && ctx.user.role !== 'moderator') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin or moderator access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // User profile management
  user: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return ctx.user;
    }),
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        bio: z.string().optional(),
        skills: z.array(z.string()).optional(),
        location: z.string().optional(),
        website: z.string().optional(),
        github: z.string().optional(),
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // Hub management
  hubs: router({
    list: publicProcedure
      .input(z.object({
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
        verified: z.boolean().optional(),
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getHubs(input);
      }),
    
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getHubBySlug(input);
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string().optional(),
        description: z.string().optional(),
        focusAreas: z.array(z.string()).optional(),
        location: z.string().optional(),
        address: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
        logo: z.string().optional(),
        verified: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const slug = input.slug || generateSlug(input.name);
        await db.createHub({
          ...input,
          slug,
          createdBy: ctx.user.id,
          status: 'pending',
        });
        const created = await db.getHubBySlug(slug);
        return created;
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        focusAreas: z.array(z.string()).optional(),
        location: z.string().optional(),
        address: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
        logo: z.string().optional(),
        verified: z.boolean().optional(),
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.status === 'approved') {
          updateData.approvedBy = ctx.user.id;
          updateData.approvedAt = new Date();
        }
        await db.updateHub(id, updateData);
        const updated = await db.getHubBySlug((await db.getHubs({ limit: 1 }))[0]?.slug || '');
        return updated;
      }),
    
    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteHub(input);
        return { success: true };
      }),
  }),

  // Community management
  communities: router({
    list: publicProcedure
      .input(z.object({
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getCommunities(input);
      }),
    
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getCommunityBySlug(input);
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string().optional(),
        description: z.string().optional(),
        focusAreas: z.array(z.string()).optional(),
        type: z.string().optional(),
        location: z.string().optional(),
        memberCount: z.number().optional(),
        email: z.string().optional(),
        website: z.string().optional(),
        slack: z.string().optional(),
        discord: z.string().optional(),
        telegram: z.string().optional(),
        twitter: z.string().optional(),
        logo: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const slug = input.slug || generateSlug(input.name);
        await db.createCommunity({
          ...input,
          slug,
          createdBy: ctx.user.id,
          status: 'pending',
        });
        const created = await db.getCommunityBySlug(slug);
        return created;
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
        verified: z.boolean().optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.status === 'approved') {
          updateData.approvedBy = ctx.user.id;
          updateData.approvedAt = new Date();
        }
        await db.updateCommunity(id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteCommunity(input);
        return { success: true };
      }),
  }),

  // Startup management
  startups: router({
    list: publicProcedure
      .input(z.object({
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getStartups(input);
      }),
    
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getStartupBySlug(input);
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string().optional(),
        description: z.string().optional(),
        industry: z.string().optional(),
        focusAreas: z.array(z.string()).optional(),
        stage: z.string().optional(),
        founded: z.number().optional(),
        location: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        teamSize: z.number().optional(),
        email: z.string().optional(),
        website: z.string().optional(),
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
        logo: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const slug = input.slug || generateSlug(input.name);
        await db.createStartup({
          ...input,
          slug,
          createdBy: ctx.user.id,
          status: 'pending',
        });
        const created = await db.getStartupBySlug(slug);
        return created;
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
        verified: z.boolean().optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.status === 'approved') {
          updateData.approvedBy = ctx.user.id;
          updateData.approvedAt = new Date();
        }
        await db.updateStartup(id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteStartup(input);
        return { success: true };
      }),
  }),

  // Job management
  jobs: router({
    list: publicProcedure
      .input(z.object({
        status: z.enum(['pending', 'approved', 'rejected', 'expired']).optional(),
        type: z.enum(['full-time', 'part-time', 'internship', 'contract']).optional(),
        remote: z.boolean().optional(),
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getJobs(input);
      }),
    
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getJobBySlug(input);
      }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string().optional(),
        company: z.string(),
        description: z.string().optional(),
        requirements: z.string().optional(),
        responsibilities: z.string().optional(),
        type: z.enum(['full-time', 'part-time', 'internship', 'contract']),
        location: z.string().optional(),
        remote: z.boolean().optional(),
        skills: z.array(z.string()).optional(),
        experienceLevel: z.string().optional(),
        salaryMin: z.number().optional(),
        salaryMax: z.number().optional(),
        currency: z.string().optional(),
        applicationUrl: z.string().optional(),
        applicationEmail: z.string().optional(),
        expiresAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const slug = input.slug || generateSlug(input.title + '-' + input.company);
        await db.createJob({
          ...input,
          slug,
          createdBy: ctx.user.id,
          status: 'pending',
        });
        const created = await db.getJobBySlug(slug);
        return created;
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'approved', 'rejected', 'expired']).optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.status === 'approved') {
          updateData.approvedBy = ctx.user.id;
          updateData.approvedAt = new Date();
        }
        await db.updateJob(id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteJob(input);
        return { success: true };
      }),
  }),

  // Gig management
  gigs: router({
    list: publicProcedure
      .input(z.object({
        status: z.enum(['pending', 'approved', 'rejected', 'completed', 'expired']).optional(),
        category: z.string().optional(),
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getGigs(input);
      }),
    
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getGigBySlug(input);
      }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string().optional(),
        description: z.string().optional(),
        requirements: z.string().optional(),
        category: z.string().optional(),
        budget: z.number().optional(),
        currency: z.string().optional(),
        duration: z.string().optional(),
        skills: z.array(z.string()).optional(),
        remote: z.boolean().optional(),
        location: z.string().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
        expiresAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const slug = input.slug || generateSlug(input.title);
        await db.createGig({
          ...input,
          slug,
          createdBy: ctx.user.id,
          status: 'pending',
        });
        const created = await db.getGigBySlug(slug);
        return created;
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'approved', 'rejected', 'completed', 'expired']).optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.status === 'approved') {
          updateData.approvedBy = ctx.user.id;
          updateData.approvedAt = new Date();
        }
        await db.updateGig(id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteGig(input);
        return { success: true };
      }),
  }),

  // Learning resources
  learning: router({
    list: publicProcedure
      .input(z.object({
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
        category: z.string().optional(),
        level: z.string().optional(),
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getLearningResources(input);
      }),
    
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getLearningResourceBySlug(input);
      }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string().optional(),
        description: z.string().optional(),
        type: z.string().optional(),
        category: z.string().optional(),
        level: z.string().optional(),
        provider: z.string().optional(),
        url: z.string().optional(),
        cost: z.string().optional(),
        duration: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const slug = input.slug || generateSlug(input.title);
        await db.createLearningResource({
          ...input,
          slug,
          createdBy: ctx.user.id,
          status: 'pending',
        });
        const created = await db.getLearningResourceBySlug(slug);
        return created;
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.status === 'approved') {
          updateData.approvedBy = ctx.user.id;
          updateData.approvedAt = new Date();
        }
        await db.updateLearningResource(id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteLearningResource(input);
        return { success: true };
      }),
  }),

  // Event management
  events: router({
    list: publicProcedure
      .input(z.object({
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
        upcoming: z.boolean().optional(),
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getEvents(input);
      }),
    
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getEventBySlug(input);
      }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string().optional(),
        description: z.string().optional(),
        type: z.string().optional(),
        category: z.string().optional(),
        startDate: z.date(),
        endDate: z.date().optional(),
        location: z.string().optional(),
        virtual: z.boolean().optional(),
        url: z.string().optional(),
        organizer: z.string().optional(),
        capacity: z.number().optional(),
        tags: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const slug = input.slug || generateSlug(input.title);
        await db.createEvent({
          ...input,
          slug,
          createdBy: ctx.user.id,
          status: 'pending',
        });
        const created = await db.getEventBySlug(slug);
        return created;
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.status === 'approved') {
          updateData.approvedBy = ctx.user.id;
          updateData.approvedAt = new Date();
        }
        await db.updateEvent(id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteEvent(input);
        return { success: true };
      }),
  }),

  // Opportunity management
  opportunities: router({
    list: publicProcedure
      .input(z.object({
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
        type: z.string().optional(),
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getOpportunities(input);
      }),
    
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getOpportunityBySlug(input);
      }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string().optional(),
        description: z.string().optional(),
        type: z.string().optional(),
        provider: z.string().optional(),
        amount: z.string().optional(),
        currency: z.string().optional(),
        deadline: z.date().optional(),
        url: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const slug = input.slug || generateSlug(input.title);
        await db.createOpportunity({
          ...input,
          slug,
          createdBy: ctx.user.id,
          status: 'pending',
        });
        const created = await db.getOpportunityBySlug(slug);
        return created;
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.status === 'approved') {
          updateData.approvedBy = ctx.user.id;
          updateData.approvedAt = new Date();
        }
        await db.updateOpportunity(id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteOpportunity(input);
        return { success: true };
      }),
  }),

  // Blog management
  blog: router({
    list: publicProcedure
      .input(z.object({
        status: z.enum(['draft', 'pending', 'published', 'archived']).optional(),
        category: z.string().optional(),
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getBlogPosts(input);
      }),
    
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getBlogPostBySlug(input);
      }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        coverImage: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const slug = input.slug || generateSlug(input.title);
        await db.createBlogPost({
          ...input,
          slug,
          authorId: ctx.user.id,
          createdBy: ctx.user.id,
          status: 'pending',
        });
        const created = await db.getBlogPostBySlug(slug);
        return created;
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['draft', 'pending', 'published', 'archived']).optional(),
        featured: z.boolean().optional(),
        publishedAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.status === 'published' && !data.publishedAt) {
          updateData.publishedAt = new Date();
        }
        await db.updateBlogPost(id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteBlogPost(input);
        return { success: true };
      }),
  }),

  // Public profiles directory
  profiles: router({
    list: publicProcedure.query(async () => {
      return await db.getAllUsers();
    }),
  }),

  // Community forum
  forum: router({
    listThreads: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getAllForumThreads(input?.category);
      }),
    
    getThread: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getForumThreadBySlug(input.slug);
      }),
    
    createThread: publicProcedure
      .input(z.object({
        title: z.string().min(5).max(500),
        content: z.string().min(10),
        category: z.enum(["general", "jobs", "events", "help", "showcase", "feedback"]),
        authorName: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const slug = generateSlug(input.title) + '-' + Date.now();
        const thread = await db.createForumThread({
          ...input,
          slug,
          authorId: ctx.user?.id || null,
          authorName: input.authorName || ctx.user?.name || 'Anonymous',
        });
        return thread;
      }),
    
    getReplies: publicProcedure
      .input(z.object({ threadId: z.number() }))
      .query(async ({ input }) => {
        return await db.getForumRepliesByThreadId(input.threadId);
      }),
    
    createReply: publicProcedure
      .input(z.object({
        threadId: z.number(),
        content: z.string().min(1),
        parentReplyId: z.number().optional(),
        authorName: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const reply = await db.createForumReply({
          ...input,
          authorId: ctx.user?.id || null,
          authorName: input.authorName || ctx.user?.name || 'Anonymous',
          parentReplyId: input.parentReplyId || null,
        });
        return reply;
      }),
    
    vote: protectedProcedure
      .input(z.object({
        targetType: z.enum(["thread", "reply"]),
        targetId: z.number(),
        voteType: z.enum(["up", "down"]),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.voteOnForumContent({
          ...input,
          userId: ctx.user.id,
        });
      }),
    
    updateThread: adminProcedure
      .input(z.object({
        id: z.number(),
        isPinned: z.boolean().optional(),
        isLocked: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        return await db.updateForumThread(id, updates);
      }),
    
    deleteThread: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteForumThread(input.id);
      }),
  }),

  // Admin functions
  admin: router({
    getPendingContent: adminProcedure.query(async () => {
      return await db.getPendingContent();
    }),
    
    getStats: adminProcedure.query(async () => {
      return await db.getContentStats();
    }),
  }),
});

export type AppRouter = typeof appRouter;
