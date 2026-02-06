import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { analyticsService } from "./_core/analytics";
import { emailService } from "./_core/email";
import * as db from "./db";
import * as dbSupabase from "./db-supabase";
import { localDB } from "./db-local";

// Helper to generate URL-friendly slugs
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Role-based procedures
const moderatorProcedure = protectedProcedure.use(({ ctx, next }) => {
  const allowedRoles = ['moderator', 'editor', 'admin'];
  if (!allowedRoles.includes(ctx.user.role)) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Moderator access or higher required' });
  }
  return next({ ctx });
});

const editorProcedure = protectedProcedure.use(({ ctx, next }) => {
  const allowedRoles = ['editor', 'admin'];
  if (!allowedRoles.includes(ctx.user.role)) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Editor access or higher required' });
  }
  return next({ ctx });
});

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
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
        isPublic: z.boolean().optional(),
        avatar: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),
    listPublicProfiles: publicProcedure.query(async () => {
      return await db.getPublicUsers();
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
        console.log('🔍 Fetching hubs with filters:', input);
        
        // Try primary database first
        try {
          console.log('📊 Trying primary database for hubs...');
          const primaryResult = await db.getHubs(input);
          console.log('📊 Primary database returned:', primaryResult?.length || 0, 'hubs');
          
          if (primaryResult && primaryResult.length > 0) {
            return primaryResult;
          }
        } catch (primaryError) {
          console.warn('❌ Primary database failed:', primaryError);
        }
        
        // Try Supabase client as fallback
        try {
          console.log('📊 Trying Supabase client for hubs...');
          const supabaseResult = await dbSupabase.getHubsSupabase(input);
          console.log('📊 Supabase client returned:', supabaseResult?.length || 0, 'hubs');
          
          if (supabaseResult && supabaseResult.length > 0) {
            return supabaseResult;
          }
        } catch (supabaseError) {
          console.warn('❌ Supabase client failed:', supabaseError);
        }
        
        // Use local database as final fallback
        console.log('⚠️ Using local database as final fallback...');
        const localResult = localDB.getHubs(input);
        console.log('📊 Local database returned:', localResult?.length || 0, 'hubs');
        return localResult;
      }),
    
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getHubBySlug(input);
      }),
    
    create: publicProcedure
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
        const hubData = {
          ...input,
          slug,
          createdBy: ctx.user?.id ?? 0,
          status: 'approved',
        };
        
        console.log('🏢 Creating hub:', hubData.name);
        
        // Try primary database first
        try {
          console.log('📊 Trying primary database for hub creation...');
          await db.createHub(hubData);
          const result = await db.getHubBySlug(slug);
          console.log('✅ Hub created in primary database:', result?.name);
          return result;
        } catch (primaryError) {
          console.warn('❌ Primary database failed for hub creation:', primaryError);
        }
        
        // Try Supabase client as fallback
        try {
          console.log('📊 Trying Supabase client for hub creation...');
          const result = await dbSupabase.createHubSupabase(hubData);
          console.log('✅ Hub created in Supabase:', result?.name);
          return result;
        } catch (supabaseError) {
          console.warn('❌ Supabase client failed for hub creation:', supabaseError);
        }
        
        // Use local database as final fallback
        console.log('⚠️ Using local database for hub creation...');
        const result = localDB.createHub(hubData);
        console.log('✅ Hub created in local database:', result?.name);
        return result;
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
        console.log('🔍 Fetching communities with filters:', input);
        
        // Try primary database first
        try {
          console.log('📊 Trying primary database for communities...');
          const primaryResult = await db.getCommunities(input);
          console.log('📊 Primary database returned:', primaryResult?.length || 0, 'communities');
          
          if (primaryResult && primaryResult.length > 0) {
            return primaryResult;
          }
        } catch (primaryError) {
          console.warn('❌ Primary database failed:', primaryError);
        }
        
        // Try Supabase client as fallback
        try {
          console.log('📊 Trying Supabase client for communities...');
          const supabaseResult = await dbSupabase.getCommunitiesSupabase(input);
          console.log('📊 Supabase client returned:', supabaseResult?.length || 0, 'communities');
          
          if (supabaseResult && supabaseResult.length > 0) {
            return supabaseResult;
          }
        } catch (supabaseError) {
          console.warn('❌ Supabase client failed:', supabaseError);
        }
        
        // Use local database as final fallback
        console.log('⚠️ Using local database for communities...');
        const localResult = localDB.getCommunities(input);
        console.log('📊 Local database returned:', localResult?.length || 0, 'communities');
        return localResult;
      }),
    
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getCommunityBySlug(input);
      }),
    
    create: publicProcedure
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
        const communityData = {
          ...input,
          slug,
          createdBy: ctx.user?.id ?? 0,
          status: 'approved',
        };
        
        console.log('👥 Creating community:', communityData.name);
        
        // Try primary database first
        try {
          console.log('📊 Trying primary database for community creation...');
          await db.createCommunity(communityData);
          const result = await db.getCommunityBySlug(slug);
          console.log('✅ Community created in primary database:', result?.name);
          return result;
        } catch (primaryError) {
          console.warn('❌ Primary database failed for community creation:', primaryError);
        }
        
        // Try Supabase client as fallback
        try {
          console.log('📊 Trying Supabase client for community creation...');
          const result = await dbSupabase.createCommunitySupabase(communityData);
          console.log('✅ Community created in Supabase:', result?.name);
          return result;
        } catch (supabaseError) {
          console.warn('❌ Supabase client failed for community creation:', supabaseError);
        }
        
        // Use local database as final fallback
        console.log('⚠️ Using local database for community creation...');
        const result = localDB.createCommunity(communityData);
        console.log('✅ Community created in local database:', result?.name);
        return result;
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
        console.log('🔍 Fetching startups with filters:', input);
        
        // Try primary database first
        try {
          console.log('📊 Trying primary database for startups...');
          const primaryResult = await db.getStartups(input);
          console.log('📊 Primary database returned:', primaryResult?.length || 0, 'startups');
          
          if (primaryResult && primaryResult.length > 0) {
            return primaryResult;
          }
        } catch (primaryError) {
          console.warn('❌ Primary database failed:', primaryError);
        }
        
        // Try Supabase client as fallback
        try {
          console.log('📊 Trying Supabase client for startups...');
          const supabaseResult = await dbSupabase.getStartupsSupabase(input);
          console.log('📊 Supabase client returned:', supabaseResult?.length || 0, 'startups');
          
          if (supabaseResult && supabaseResult.length > 0) {
            return supabaseResult;
          }
        } catch (supabaseError) {
          console.warn('❌ Supabase client failed:', supabaseError);
        }
        
        // Use local database as final fallback
        console.log('⚠️ Using local database for startups...');
        const localResult = localDB.getStartups(input);
        console.log('📊 Local database returned:', localResult?.length || 0, 'startups');
        return localResult;
      }),
    
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getStartupBySlug(input);
      }),
    
    create: publicProcedure
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
        const startupData = {
          ...input,
          slug,
          createdBy: ctx.user?.id ?? 0,
          status: 'approved',
        };
        
        console.log('🚀 Creating startup:', startupData.name);
        
        // Try primary database first
        try {
          console.log('📊 Trying primary database for startup creation...');
          await db.createStartup(startupData);
          const result = await db.getStartupBySlug(slug);
          console.log('✅ Startup created in primary database:', result?.name);
          return result;
        } catch (primaryError) {
          console.warn('❌ Primary database failed for startup creation:', primaryError);
        }
        
        // Try Supabase client as fallback
        try {
          console.log('📊 Trying Supabase client for startup creation...');
          const result = await dbSupabase.createStartupSupabase(startupData);
          console.log('✅ Startup created in Supabase:', result?.name);
          return result;
        } catch (supabaseError) {
          console.warn('❌ Supabase client failed for startup creation:', supabaseError);
        }
        
        // Use local database as final fallback
        console.log('⚠️ Using local database for startup creation...');
        const result = localDB.createStartup(startupData);
        console.log('✅ Startup created in local database:', result?.name);
        return result;
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
        console.log('🔍 Fetching jobs with filters:', input);
        
        // Try Supabase client first (most reliable)
        try {
          console.log('📊 Trying Supabase client for jobs...');
          const supabaseResult = await dbSupabase.getJobsSupabase(input);
          console.log('📊 Supabase client returned:', supabaseResult?.length || 0, 'jobs');
          
          if (supabaseResult && supabaseResult.length >= 0) {
            return supabaseResult;
          }
        } catch (supabaseError) {
          console.warn('❌ Supabase client failed:', supabaseError);
        }
        
        // Try primary database as backup
        try {
          console.log('📊 Trying primary database for jobs...');
          const primaryResult = await db.getJobs(input);
          console.log('📊 Primary database returned:', primaryResult?.length || 0, 'jobs');
          
          if (primaryResult && primaryResult.length >= 0) {
            return primaryResult;
          }
        } catch (primaryError) {
          console.warn('❌ Primary database failed:', primaryError);
        }
        
        // Use local database as final fallback
        console.log('⚠️ Using local database for jobs...');
        const localResult = localDB.getJobs(input);
        console.log('📊 Local database returned:', localResult?.length || 0, 'jobs');
        return localResult;
      }),
    
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        try {
          return await db.getJobBySlug(input);
        } catch (error) {
          console.warn('❌ Failed to get job by slug, trying local:', error);
          return localDB.getJobBySlug(input);
        }
      }),
    
    create: publicProcedure
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
        const jobData = {
          ...input,
          slug,
          createdBy: ctx.user?.id ?? 0, // Use 0 for anonymous submissions
          status: 'approved', // Auto-approve anonymous submissions
        };
        
        console.log('💼 Creating job:', jobData.title);
        
        // Try primary Supabase database first
        try {
          console.log('📊 Trying primary Supabase database for job creation...');
          await db.createJob(jobData);
          const result = await db.getJobBySlug(slug);
          if (result) {
            console.log('✅ Job created in PRIMARY SUPABASE database:', result?.title);
            return result;
          }
        } catch (primaryError) {
          console.error('❌ PRIMARY SUPABASE database failed for job creation:', primaryError);
        }
        
        // Try Supabase client as backup
        try {
          console.log('📊 Trying Supabase client for job creation...');
          const result = await dbSupabase.createJobSupabase(jobData);
          console.log('✅ Job created in SUPABASE CLIENT:', result?.title);
          return result;
        } catch (supabaseError) {
          console.error('❌ SUPABASE CLIENT failed for job creation:', supabaseError);
        }
        
        // Only use local database as absolute last resort
        console.warn('⚠️ USING LOCAL DATABASE - DATA WILL NOT BE PERSISTENT!');
        const result = localDB.createJob(jobData);
        console.log('✅ Job created in LOCAL database (NOT PERSISTENT):', result?.title);
        return result;
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
        console.log('🔍 Fetching gigs with filters:', input);
        
        // Try Supabase client first (most reliable)
        try {
          console.log('📊 Trying Supabase client for gigs...');
          const supabaseResult = await dbSupabase.getGigsSupabase(input);
          console.log('📊 Supabase client returned:', supabaseResult?.length || 0, 'gigs');
          
          if (supabaseResult && supabaseResult.length >= 0) {
            return supabaseResult;
          }
        } catch (supabaseError) {
          console.warn('❌ Supabase client failed:', supabaseError);
        }
        
        // Try primary database as backup
        try {
          console.log('📊 Trying primary database for gigs...');
          const primaryResult = await db.getGigs(input);
          console.log('📊 Primary database returned:', primaryResult?.length || 0, 'gigs');
          
          if (primaryResult && primaryResult.length >= 0) {
            return primaryResult;
          }
        } catch (primaryError) {
          console.warn('❌ Primary database failed:', primaryError);
        }
        
        // Use local database as final fallback
        console.log('⚠️ Using local database for gigs...');
        const localResult = localDB.getGigs(input);
        console.log('📊 Local database returned:', localResult?.length || 0, 'gigs');
        return localResult;
      }),
    
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        try {
          return await db.getGigBySlug(input);
        } catch (error) {
          console.warn('❌ Failed to get gig by slug, trying local:', error);
          return localDB.getGigBySlug(input);
        }
      }),
    
    create: publicProcedure
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
        const gigData = {
          ...input,
          slug,
          createdBy: ctx.user?.id ?? 0, // Use 0 for anonymous submissions
          status: 'approved', // Auto-approve anonymous submissions
        };
        
        console.log('🎯 Creating gig:', gigData.title);
        
        // Try primary Supabase database first
        try {
          console.log('📊 Trying primary Supabase database for gig creation...');
          await db.createGig(gigData);
          const result = await db.getGigBySlug(slug);
          if (result) {
            console.log('✅ Gig created in PRIMARY SUPABASE database:', result?.title);
            return result;
          }
        } catch (primaryError) {
          console.error('❌ PRIMARY SUPABASE database failed for gig creation:', primaryError);
        }
        
        // Try Supabase client as backup
        try {
          console.log('📊 Trying Supabase client for gig creation...');
          const result = await dbSupabase.createGigSupabase(gigData);
          console.log('✅ Gig created in SUPABASE CLIENT:', result?.title);
          return result;
        } catch (supabaseError) {
          console.error('❌ SUPABASE CLIENT failed for gig creation:', supabaseError);
        }
        
        // Only use local database as absolute last resort
        console.warn('⚠️ USING LOCAL DATABASE - DATA WILL NOT BE PERSISTENT!');
        const result = localDB.createGig(gigData);
        console.log('✅ Gig created in LOCAL database (NOT PERSISTENT):', result?.title);
        return result;
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
        console.log('🔍 Fetching learning resources with filters:', input);
        
        // Try Supabase client first (most reliable)
        try {
          console.log('📊 Trying Supabase client for learning resources...');
          const supabaseResult = await dbSupabase.getLearningResourcesSupabase(input);
          console.log('📊 Supabase client returned:', supabaseResult?.length || 0, 'learning resources');
          
          if (supabaseResult && supabaseResult.length >= 0) {
            return supabaseResult;
          }
        } catch (supabaseError) {
          console.warn('❌ Supabase client failed:', supabaseError);
        }
        
        // Try primary database as backup
        try {
          console.log('📊 Trying primary database for learning resources...');
          const primaryResult = await db.getLearningResources(input);
          console.log('📊 Primary database returned:', primaryResult?.length || 0, 'learning resources');
          
          if (primaryResult && primaryResult.length >= 0) {
            return primaryResult;
          }
        } catch (primaryError) {
          console.warn('❌ Primary database failed:', primaryError);
        }
        
        // Use local database as final fallback
        console.log('⚠️ Using empty fallback for learning resources...');
        return [];
      }),
    
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        try {
          return await db.getLearningResourceBySlug(input);
        } catch (error) {
          console.warn('❌ Failed to get learning resource by slug:', error);
          return undefined;
        }
      }),
    
    create: publicProcedure
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
        const resourceData = {
          ...input,
          slug,
          createdBy: ctx.user?.id ?? 0, // Use 0 for anonymous submissions
          status: 'approved', // Auto-approve anonymous submissions
        };
        
        console.log('📚 Creating learning resource:', resourceData.title);
        
        // Try Supabase client first (most reliable)
        try {
          console.log('📊 Trying Supabase client for learning resource creation...');
          const result = await dbSupabase.createLearningResourceSupabase(resourceData);
          console.log('✅ Learning resource created in SUPABASE CLIENT:', result?.title);
          return result;
        } catch (supabaseError) {
          console.error('❌ SUPABASE CLIENT failed for learning resource creation:', supabaseError);
        }
        
        // Try primary Supabase database as backup
        try {
          console.log('📊 Trying primary Supabase database for learning resource creation...');
          await db.createLearningResource(resourceData);
          const result = await db.getLearningResourceBySlug(slug);
          if (result) {
            console.log('✅ Learning resource created in PRIMARY SUPABASE database:', result?.title);
            return result;
          }
        } catch (primaryError) {
          console.error('❌ PRIMARY SUPABASE database failed for learning resource creation:', primaryError);
        }
        
        // Return mock success response as final fallback
        console.warn('⚠️ USING MOCK RESPONSE - DATA WILL NOT BE PERSISTENT!');
        return {
          id: Date.now(),
          ...resourceData,
          createdAt: new Date(),
          updatedAt: new Date(),
          approvedAt: new Date(),
          featured: false,
          approvedBy: null,
        };
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
        console.log('🔍 Fetching events with filters:', input);
        
        // Try Supabase client first (most reliable)
        try {
          console.log('📊 Trying Supabase client for events...');
          const supabaseResult = await dbSupabase.getEventsSupabase(input);
          console.log('📊 Supabase client returned:', supabaseResult?.length || 0, 'events');
          
          if (supabaseResult && supabaseResult.length >= 0) {
            return supabaseResult;
          }
        } catch (supabaseError) {
          console.warn('❌ Supabase client failed:', supabaseError);
        }
        
        // Try primary database as backup
        try {
          console.log('📊 Trying primary database for events...');
          const primaryResult = await db.getEvents(input);
          console.log('📊 Primary database returned:', primaryResult?.length || 0, 'events');
          
          if (primaryResult && primaryResult.length >= 0) {
            return primaryResult;
          }
        } catch (primaryError) {
          console.warn('❌ Primary database failed:', primaryError);
        }
        
        // Use empty array as final fallback
        console.log('⚠️ Using empty fallback for events...');
        return [];
      }),
    
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        try {
          return await db.getEventBySlug(input);
        } catch (error) {
          console.warn('❌ Failed to get event by slug:', error);
          return undefined;
        }
      }),
    
    create: publicProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string().optional(),
        description: z.string().optional(),
        type: z.string().optional(),
        category: z.string().optional(),
        startDate: z.date(),
        endDate: z.date().optional(),
        location: z.string().optional(),
        address: z.string().optional(),
        virtual: z.boolean().optional(),
        meetingUrl: z.string().optional(),
        registrationUrl: z.string().optional(),
        organizer: z.string().optional(),
        organizerEmail: z.string().optional(),
        capacity: z.number().optional(),
        tags: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const slug = input.slug || generateSlug(input.title);
        const eventData = {
          ...input,
          slug,
          createdBy: ctx.user?.id ?? 0, // Use 0 for anonymous submissions
          status: 'approved', // Auto-approve anonymous submissions
        };
        
        console.log('📅 Creating event:', eventData.title);
        
        // Try Supabase client first (most reliable)
        try {
          console.log('📊 Trying Supabase client for event creation...');
          const result = await dbSupabase.createEventSupabase(eventData);
          console.log('✅ Event created in SUPABASE CLIENT:', result?.title);
          return result;
        } catch (supabaseError) {
          console.error('❌ SUPABASE CLIENT failed for event creation:', supabaseError);
        }
        
        // Try primary Supabase database as backup
        try {
          console.log('📊 Trying primary Supabase database for event creation...');
          await db.createEvent(eventData);
          const result = await db.getEventBySlug(slug);
          if (result) {
            console.log('✅ Event created in PRIMARY SUPABASE database:', result?.title);
            return result;
          }
        } catch (primaryError) {
          console.error('❌ PRIMARY SUPABASE database failed for event creation:', primaryError);
        }
        
        // Return mock success response as final fallback
        console.warn('⚠️ USING MOCK RESPONSE - DATA WILL NOT BE PERSISTENT!');
        return {
          id: Date.now(),
          ...eventData,
          createdAt: new Date(),
          updatedAt: new Date(),
          approvedAt: new Date(),
          featured: false,
          approvedBy: null,
        };
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
        console.log('🔍 Fetching opportunities with filters:', input);
        
        // Try Supabase client first (most reliable)
        try {
          console.log('📊 Trying Supabase client for opportunities...');
          const supabaseResult = await dbSupabase.getOpportunitiesSupabase(input);
          console.log('📊 Supabase client returned:', supabaseResult?.length || 0, 'opportunities');
          
          if (supabaseResult && supabaseResult.length >= 0) {
            return supabaseResult;
          }
        } catch (supabaseError) {
          console.warn('❌ Supabase client failed:', supabaseError);
        }
        
        // Try primary database as backup
        try {
          console.log('📊 Trying primary database for opportunities...');
          const primaryResult = await db.getOpportunities(input);
          console.log('📊 Primary database returned:', primaryResult?.length || 0, 'opportunities');
          
          if (primaryResult && primaryResult.length >= 0) {
            return primaryResult;
          }
        } catch (primaryError) {
          console.warn('❌ Primary database failed:', primaryError);
        }
        
        // Use empty array as final fallback
        console.log('⚠️ Using empty fallback for opportunities...');
        return [];
      }),
    
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        try {
          return await db.getOpportunityBySlug(input);
        } catch (error) {
          console.warn('❌ Failed to get opportunity by slug:', error);
          return undefined;
        }
      }),
    
    create: publicProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string().optional(),
        description: z.string().optional(),
        type: z.string().optional(),
        category: z.string().optional(),
        provider: z.string().optional(),
        amount: z.string().optional(),
        currency: z.string().optional(),
        eligibility: z.string().optional(),
        applicationUrl: z.string().optional(),
        deadline: z.date().optional(),
        tags: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const slug = input.slug || generateSlug(input.title);
        const opportunityData = {
          ...input,
          slug,
          createdBy: ctx.user?.id ?? 0, // Use 0 for anonymous submissions
          status: 'approved', // Auto-approve anonymous submissions
        };
        
        console.log('🎯 Creating opportunity:', opportunityData.title);
        
        // Try Supabase client first (most reliable)
        try {
          console.log('📊 Trying Supabase client for opportunity creation...');
          const result = await dbSupabase.createOpportunitySupabase(opportunityData);
          console.log('✅ Opportunity created in SUPABASE CLIENT:', result?.title);
          return result;
        } catch (supabaseError) {
          console.error('❌ SUPABASE CLIENT failed for opportunity creation:', supabaseError);
        }
        
        // Try primary Supabase database as backup
        try {
          console.log('📊 Trying primary Supabase database for opportunity creation...');
          await db.createOpportunity(opportunityData);
          const result = await db.getOpportunityBySlug(slug);
          if (result) {
            console.log('✅ Opportunity created in PRIMARY SUPABASE database:', result?.title);
            return result;
          }
        } catch (primaryError) {
          console.error('❌ PRIMARY SUPABASE database failed for opportunity creation:', primaryError);
        }
        
        // Return mock success response as final fallback
        console.warn('⚠️ USING MOCK RESPONSE - DATA WILL NOT BE PERSISTENT!');
        return {
          id: Date.now(),
          ...opportunityData,
          createdAt: new Date(),
          updatedAt: new Date(),
          approvedAt: new Date(),
          featured: false,
          approvedBy: null,
        };
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

  // Dashboard statistics (public)
  stats: router({
    getCounts: publicProcedure.query(async () => {
      console.log('📊 Fetching platform statistics...');
      
      // Try primary database first
      try {
        const stats = await db.getContentStats();
        if (stats) {
          console.log('✅ Stats from primary database:', stats);
          return stats;
        }
      } catch (primaryError) {
        console.warn('❌ Primary database failed for stats:', primaryError);
      }
      
      // Try Supabase client as fallback
      try {
        console.log('📊 Trying Supabase client for stats...');
        const [
          hubsResult,
          communitiesResult,
          startupsResult,
          jobsResult,
          gigsResult,
          eventsResult,
          opportunitiesResult,
          learningResult
        ] = await Promise.all([
          dbSupabase.getHubsSupabase({ status: 'approved' }),
          dbSupabase.getCommunitiesSupabase({ status: 'approved' }),
          dbSupabase.getStartupsSupabase({ status: 'approved' }),
          dbSupabase.getJobsSupabase({ status: 'approved' }),
          dbSupabase.getGigsSupabase({ status: 'approved' }),
          dbSupabase.getEventsSupabase({ status: 'approved' }),
          dbSupabase.getOpportunitiesSupabase({ status: 'approved' }),
          dbSupabase.getLearningResourcesSupabase({ status: 'approved' })
        ]);
        
        const supabaseStats = {
          hubs: hubsResult?.length || 0,
          communities: communitiesResult?.length || 0,
          startups: startupsResult?.length || 0,
          jobs: jobsResult?.length || 0,
          gigs: gigsResult?.length || 0,
          events: eventsResult?.length || 0,
          opportunities: opportunitiesResult?.length || 0,
          learningResources: learningResult?.length || 0,
          blogPosts: 0, // Blog posts not implemented yet
        };
        
        console.log('✅ Stats from Supabase client:', supabaseStats);
        return supabaseStats;
      } catch (supabaseError) {
        console.warn('❌ Supabase client failed for stats:', supabaseError);
      }
      
      // Use local database as final fallback
      console.log('⚠️ Using local database for stats...');
      const localStats = localDB.getStats();
      return {
        hubs: localStats.hubs,
        communities: localStats.communities,
        startups: localStats.startups,
        jobs: localStats.jobs,
        gigs: localStats.gigs,
        events: localStats.events,
        learningResources: localStats.learningResources,
        opportunities: localStats.opportunities,
        blogPosts: 0,
      };
    }),

    // Debug endpoint to check database status
    debug: publicProcedure.query(async () => {
      const localStats = localDB.getStats();
      return {
        message: 'Database status check',
        localDatabase: localStats,
        timestamp: new Date().toISOString()
      };
    }),
  }),

  // Admin functions
  admin: router({
    getPendingContent: moderatorProcedure.query(async () => {
      return await db.getPendingContent();
    }),
    
    getStats: moderatorProcedure.query(async () => {
      return await db.getContentStats();
    }),

    // Role management (Admin only)
    getRoleHierarchy: adminProcedure.query(async () => {
      // This would fetch from role_hierarchy table
      return [
        { roleName: 'user', displayName: 'Community Member', level: 1 },
        { roleName: 'moderator', displayName: 'Content Moderator', level: 2 },
        { roleName: 'editor', displayName: 'Content Editor', level: 3 },
        { roleName: 'admin', displayName: 'Platform Administrator', level: 4 },
      ];
    }),

    getAllUsers: adminProcedure.query(async () => {
      return await db.getAllUsers();
    }),

    updateUserRole: adminProcedure
      .input(z.object({
        userId: z.number(),
        newRole: z.enum(['user', 'moderator', 'editor', 'admin']),
        reason: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Update user role and log the change
        await db.updateUserRole(input.userId, input.newRole, ctx.user.id, input.reason);
        return { success: true };
      }),

    // Analytics dashboard
    getAnalytics: adminProcedure
      .input(z.object({
        period: z.enum(['7d', '30d', '90d']).optional().default('30d'),
      }))
      .query(async ({ input }) => {
        const now = Date.now();
        const periodMs = {
          '7d': 7 * 24 * 60 * 60 * 1000,
          '30d': 30 * 24 * 60 * 60 * 1000,
          '90d': 90 * 24 * 60 * 60 * 1000,
        };
        
        const startAt = now - periodMs[input.period];
        
        return await analyticsService.getStats({
          startAt,
          endAt: now,
          unit: input.period === '7d' ? 'day' : 'day'
        });
      }),

    getTopPages: adminProcedure
      .input(z.object({
        period: z.enum(['7d', '30d', '90d']).optional().default('30d'),
      }))
      .query(async ({ input }) => {
        const now = Date.now();
        const periodMs = {
          '7d': 7 * 24 * 60 * 60 * 1000,
          '30d': 30 * 24 * 60 * 60 * 1000,
          '90d': 90 * 24 * 60 * 60 * 1000,
        };
        
        const startAt = now - periodMs[input.period];
        
        return await analyticsService.getTopPages({
          startAt,
          endAt: now
        });
      }),

    sendTestEmail: adminProcedure
      .input(z.object({
        to: z.string().email(),
        type: z.enum(['welcome', 'approval']).optional().default('welcome'),
      }))
      .mutation(async ({ input }) => {
        if (input.type === 'welcome') {
          return await emailService.sendWelcomeEmail(input.to, 'Test User');
        } else {
          return await emailService.sendContentApprovalEmail(
            input.to, 
            'test content', 
            'Test Submission', 
            true
          );
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
