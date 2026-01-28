import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(user?: AuthenticatedUser): TrpcContext {
  return {
    user: user || null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAdminUser(): AuthenticatedUser {
  return {
    id: 1,
    openId: "admin-test",
    email: "admin@techatlas.ug",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

function createRegularUser(): AuthenticatedUser {
  return {
    id: 2,
    openId: "user-test",
    email: "user@techatlas.ug",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

describe("Tech Atlas Platform Tests", () => {
  describe("Authentication", () => {
    it("should return current user for authenticated requests", async () => {
      const user = createRegularUser();
      const ctx = createMockContext(user);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.me();
      expect(result).toEqual(user);
    });

    it("should return null for unauthenticated requests", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.me();
      expect(result).toBeNull();
    });
  });

  describe("Hubs", () => {
    it("should list approved hubs for public access", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.hubs.list({ status: "approved" });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should allow authenticated users to create hubs", async () => {
      const user = createRegularUser();
      const ctx = createMockContext(user);
      const caller = appRouter.createCaller(ctx);

      const hubData = {
        name: "Test Hub",
        slug: "test-hub-" + Date.now(),
        description: "A test tech hub",
        location: "Kampala",
        focusAreas: ["Web Development", "Mobile Apps"],
        verified: false,
      };

      const result = await caller.hubs.create(hubData);
      expect(result.name).toBe(hubData.name);
      expect(result.status).toBe("pending");
    });
  });

  describe("Jobs", () => {
    it("should list approved jobs for public access", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.jobs.list({ status: "approved" });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should allow authenticated users to create job listings", async () => {
      const user = createRegularUser();
      const ctx = createMockContext(user);
      const caller = appRouter.createCaller(ctx);

      const jobData = {
        title: "Senior Developer",
        slug: "senior-dev-" + Date.now(),
        company: "Tech Company",
        description: "Looking for a senior developer",
        type: "full-time" as const,
        location: "Kampala",
        remote: false,
        skills: ["JavaScript", "React", "Node.js"],
      };

      const result = await caller.jobs.create(jobData);
      expect(result.title).toBe(jobData.title);
      expect(result.status).toBe("pending");
    });
  });

  describe("Learning Resources", () => {
    it("should list approved learning resources", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.learning.list({ status: "approved" });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should allow authenticated users to submit learning resources", async () => {
      const user = createRegularUser();
      const ctx = createMockContext(user);
      const caller = appRouter.createCaller(ctx);

      const resourceData = {
        title: "Learn React",
        slug: "learn-react-" + Date.now(),
        description: "Comprehensive React course",
        url: "https://example.com/react",
        type: "course" as const,
        category: "Web Development",
        level: "beginner" as const,
        cost: "free" as const,
      };

      const result = await caller.learning.create(resourceData);
      expect(result.title).toBe(resourceData.title);
      expect(result.status).toBe("pending");
    });
  });

  describe("Events", () => {
    it("should list upcoming approved events", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.events.list({ 
        status: "approved",
        upcoming: true 
      });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should allow authenticated users to create events", async () => {
      const user = createRegularUser();
      const ctx = createMockContext(user);
      const caller = appRouter.createCaller(ctx);

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      const eventData = {
        title: "Tech Meetup",
        slug: "tech-meetup-" + Date.now(),
        description: "Monthly tech community meetup",
        type: "meetup" as const,
        startDate: futureDate,
        location: "Kampala",
        virtual: false,
      };

      const result = await caller.events.create(eventData);
      expect(result.title).toBe(eventData.title);
      expect(result.status).toBe("pending");
    });
  });

  describe("Blog Posts", () => {
    it("should list published blog posts", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.blog.list({ status: "published" });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should allow authenticated users to create blog posts", async () => {
      const user = createRegularUser();
      const ctx = createMockContext(user);
      const caller = appRouter.createCaller(ctx);

      const postData = {
        title: "My Tech Journey",
        slug: "my-tech-journey-" + Date.now(),
        excerpt: "A story about my journey in tech",
        content: "# My Journey\n\nThis is my story...",
        category: "Community Spotlight",
      };

      const result = await caller.blog.create(postData);
      expect(result.title).toBe(postData.title);
      expect(result.status).toBe("pending");
    });
  });

  describe("Admin Functions", () => {
    it("should allow admins to access pending content", async () => {
      const admin = createAdminUser();
      const ctx = createMockContext(admin);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.getPendingContent();
      expect(result).toHaveProperty("hubs");
      expect(result).toHaveProperty("jobs");
      expect(result).toHaveProperty("learningResources");
      expect(result).toHaveProperty("events");
      expect(result).toHaveProperty("blogPosts");
    });

    it("should allow admins to get platform stats", async () => {
      const admin = createAdminUser();
      const ctx = createMockContext(admin);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.getStats();
      expect(result).toHaveProperty("hubs");
      expect(result).toHaveProperty("jobs");
      expect(result).toHaveProperty("events");
      expect(typeof result.hubs).toBe("number");
    });

    it("should prevent non-admins from accessing admin functions", async () => {
      const user = createRegularUser();
      const ctx = createMockContext(user);
      const caller = appRouter.createCaller(ctx);

      await expect(caller.admin.getPendingContent()).rejects.toThrow();
    });
  });

  describe("Content Moderation", () => {
    it("should allow admins to approve content", async () => {
      const admin = createAdminUser();
      const ctx = createMockContext(admin);
      const caller = appRouter.createCaller(ctx);

      // First create a hub as regular user
      const userCtx = createMockContext(createRegularUser());
      const userCaller = appRouter.createCaller(userCtx);
      
      const hub = await userCaller.hubs.create({
        name: "Test Hub for Approval",
        slug: "test-hub-approval-" + Date.now(),
        description: "Testing approval workflow",
        location: "Kampala",
      });

      // Admin approves it
      const result = await caller.hubs.update({
        id: hub.id,
        status: "approved",
      });

      expect(result.status).toBe("approved");
    });

    it("should allow admins to reject content", async () => {
      const admin = createAdminUser();
      const ctx = createMockContext(admin);
      const caller = appRouter.createCaller(ctx);

      // First create a job as regular user
      const userCtx = createMockContext(createRegularUser());
      const userCaller = appRouter.createCaller(userCtx);
      
      const job = await userCaller.jobs.create({
        title: "Test Job for Rejection",
        slug: "test-job-rejection-" + Date.now(),
        company: "Test Company",
        description: "Testing rejection workflow",
        type: "full-time",
        location: "Kampala",
      });

      // Admin rejects it
      const result = await caller.jobs.update({
        id: job.id,
        status: "rejected",
      });

      expect(result.status).toBe("rejected");
    });
  });
});
