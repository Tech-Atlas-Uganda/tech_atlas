import { Router } from 'express';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { getDb } from '../db.js';
import { sql } from 'drizzle-orm';

const router = Router();

// Initialize Gemini AI
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  
  return new GoogleGenAI({ apiKey });
};

// Fetch real-time stats from database
async function getDatabaseStats() {
  try {
    const db = await getDb();
    if (!db) {
      console.error('Database not available');
      return null;
    }

    // Query all records and count them (same as dashboard)
    const [hubs] = await db.execute(sql`SELECT * FROM tech_hubs WHERE status = 'approved'`);
    const [communities] = await db.execute(sql`SELECT * FROM communities WHERE status = 'approved'`);
    const [startups] = await db.execute(sql`SELECT * FROM startups WHERE status = 'approved'`);
    const [jobs] = await db.execute(sql`SELECT * FROM opportunities WHERE type = 'job' AND status = 'approved'`);
    const [gigs] = await db.execute(sql`SELECT * FROM opportunities WHERE type = 'gig' AND status = 'approved'`);
    const [events] = await db.execute(sql`SELECT * FROM events WHERE status = 'approved'`);
    const [blogPosts] = await db.execute(sql`SELECT * FROM blog_posts WHERE status = 'published'`);
    const [users] = await db.execute(sql`SELECT * FROM users`);
    const [forumPosts] = await db.execute(sql`SELECT * FROM forum_posts`);

    return {
      hubs: hubs.rows?.length || 0,
      communities: communities.rows?.length || 0,
      startups: startups.rows?.length || 0,
      jobs: jobs.rows?.length || 0,
      gigs: gigs.rows?.length || 0,
      events: events.rows?.length || 0,
      blog_posts: blogPosts.rows?.length || 0,
      total_users: users.rows?.length || 0,
      forum_posts: forumPosts.rows?.length || 0,
    };
  } catch (error) {
    console.error('Error fetching database stats:', error);
    return {
      hubs: 3,
      communities: 0,
      startups: 1,
      jobs: 0,
      gigs: 0,
      events: 0,
      blog_posts: 0,
      total_users: 0,
      forum_posts: 0,
    };
  }
}

// Generate infographic
router.post('/generate', async (req, res) => {
  try {
    let ai;
    try {
      ai = getGeminiClient();
    } catch (error) {
      console.error('API Key Error:', error);
      return res.status(500).json({
        error: 'API key not configured',
        message: error instanceof Error ? error.message : 'GEMINI_API_KEY missing',
      });
    }

    const stats = await getDatabaseStats();

    if (!stats) {
      return res.status(500).json({ 
        error: 'Failed to fetch database stats',
        message: 'Could not retrieve data'
      });
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const prompt = `Create a stunning, modern infographic for Tech Atlas Uganda with ALL these statistics:

📊 ECOSYSTEM DATA (Real-Time):
- ${stats.hubs} Tech Hubs
- ${stats.communities} Communities
- ${stats.startups} Startups
- ${stats.jobs} Job Listings
- ${stats.gigs} Gig Opportunities
- ${stats.events} Events
- ${stats.blog_posts} Blog Posts
- ${stats.total_users} Total Users
- ${stats.forum_posts} Forum Discussions

🎨 DESIGN REQUIREMENTS:
- IMPORTANT: SVG must be EXACTLY 1080x1080px (width="1080" height="1080" viewBox="0 0 1080 1080")
- Modern, vibrant purple/pink/blue gradient color scheme
- Include "Tech Atlas Uganda" branding prominently at top
- Use icons and visual elements for each metric
- Professional, shareable design
- Add tagline: "Uganda's Tech Ecosystem"
- Include website: techatlasug.com at bottom
- Add generation timestamp: "Generated: ${dateStr} at ${timeStr}" in small text at bottom
- Use charts, progress bars, or creative data visualization
- Make it eye-catching and social media ready
- ALL content must fit within the 1080x1080px frame

📱 FORMAT: Return ONLY valid SVG code that can be rendered in browser
🎯 GOAL: Showcase Uganda's growing tech ecosystem in one beautiful visual

CRITICAL: Ensure the SVG has width="1080" height="1080" viewBox="0 0 1080 1080" and all content fits within these bounds.

Return ONLY the SVG code, no explanations or markdown.`;

    const config = {
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.HIGH,
      },
      temperature: 0.9,
      topP: 0.95,
    };

    const model = 'gemini-3-flash-preview';

    const contents = [{
      role: 'user',
      parts: [{ text: prompt }],
    }];

    console.log('Generating infographic...');
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let svgCode = '';
    for await (const chunk of response) {
      if (chunk.text) {
        svgCode += chunk.text;
      }
    }

    svgCode = svgCode.trim();
    
    const svgMatch = svgCode.match(/```(?:svg)?\s*([\s\S]*?)```/);
    if (svgMatch) {
      svgCode = svgMatch[1].trim();
    }

    if (!svgCode.startsWith('<svg')) {
      const svgStart = svgCode.indexOf('<svg');
      if (svgStart !== -1) {
        svgCode = svgCode.substring(svgStart);
      }
    }

    if (!svgCode.endsWith('</svg>')) {
      const svgEnd = svgCode.lastIndexOf('</svg>');
      if (svgEnd !== -1) {
        svgCode = svgCode.substring(0, svgEnd + 6);
      }
    }

    console.log('Infographic generated successfully');
    res.json({
      success: true,
      svg: svgCode,
      stats,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating infographic:', error);
    res.status(500).json({
      error: 'Failed to generate infographic',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
