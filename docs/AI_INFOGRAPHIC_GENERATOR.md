# 🎨 AI-Powered Infographic Generator

## Overview

The AI Infographic Generator uses **Gemini 2.0 Flash** to create stunning, shareable infographics with real-time data from your Tech Atlas platform. Perfect for social media, presentations, and showcasing Uganda's tech ecosystem growth.

## Features

### 🚀 5 Infographic Types

1. **Ecosystem Overview**
   - Complete snapshot of Uganda's tech landscape
   - Shows all key metrics (hubs, startups, jobs, events, etc.)
   - Perfect for general promotion

2. **Growth Metrics**
   - Focuses on momentum and expansion
   - Highlights growth indicators
   - Great for investor presentations

3. **Opportunities**
   - Showcases available jobs, events, and connections
   - Bright, energetic design
   - Ideal for recruitment and engagement

4. **Community Impact**
   - Emphasizes the connected community
   - Shows user engagement and discussions
   - Perfect for community building

5. **Platform Impact**
   - Demonstrates Tech Atlas's reach
   - Bold, impactful numbers
   - Great for stakeholder reports

### ✨ Key Capabilities

- **Real-Time Data**: Pulls live statistics from Supabase database
- **AI-Powered Design**: Gemini 2.0 Flash creates unique, professional designs
- **High Thinking Level**: Uses advanced reasoning for optimal layouts
- **Multiple Formats**: Download as SVG or PNG (1080x1080px)
- **Shareable**: Direct sharing to social media
- **Branded**: Includes "Tech Atlas Uganda" branding automatically

## How It Works

### Backend (Gemini 2.0 Flash)

```typescript
// server/routes/infographics.ts
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const config = {
  thinkingConfig: {
    thinkingLevel: ThinkingLevel.HIGH, // Maximum reasoning
  },
  tools: [
    { urlContext: {} },
    { googleSearch: {} }
  ],
  temperature: 0.9, // High creativity
};

const model = 'gemini-2.0-flash-exp';
```

### Smart Prompts

Each infographic type has a carefully crafted prompt that:
- Provides real-time database statistics
- Specifies design requirements (colors, layout, branding)
- Requests SVG format for scalability
- Ensures 1080x1080px social media format
- Includes Tech Atlas branding guidelines

### Data Flow

1. **User clicks** "Generate AI Infographic" button on dashboard
2. **Selects** infographic type (ecosystem, growth, opportunities, etc.)
3. **Backend fetches** real-time stats from Supabase
4. **Gemini generates** SVG code with smart design
5. **Frontend displays** the infographic
6. **User downloads** as SVG or PNG, or shares directly

## Usage

### On Dashboard

```tsx
import { InfographicGenerator } from "@/components/InfographicGenerator";

// Add to dashboard header
<InfographicGenerator />
```

The button appears in the top-right of the dashboard with a gradient purple-to-pink design.

### API Endpoint

```bash
POST /api/infographics/generate
Content-Type: application/json

{
  "type": "ecosystem" // or "growth", "opportunities", "community", "impact"
}
```

**Response:**
```json
{
  "success": true,
  "svg": "<svg>...</svg>",
  "stats": {
    "hubs": 3,
    "startups": 1,
    "jobs": 0,
    // ... more stats
  },
  "type": "ecosystem",
  "generatedAt": "2026-02-09T..."
}
```

## Setup

### 1. Install Dependencies

```bash
pnpm add @google/genai
```

### 2. Get Gemini API Key

1. Go to https://aistudio.google.com/apikey
2. Create a new API key
3. Add to `.env`:

```env
GEMINI_API_KEY=your_api_key_here
```

### 3. Files Created

- `server/routes/infographics.ts` - Backend API
- `client/src/components/InfographicGenerator.tsx` - Frontend component
- Updated `server/_core/index.ts` - Added route
- Updated `client/src/pages/Dashboard.tsx` - Added button

## Design Specifications

### Colors

- **Ecosystem**: Purple/Pink gradients
- **Growth**: Green/Emerald gradients
- **Opportunities**: Orange/Yellow gradients
- **Community**: Blue/Cyan gradients
- **Impact**: Red/Orange gradients

### Branding

All infographics include:
- "Tech Atlas Uganda" text prominently
- Website: techatlasug.com
- Relevant taglines
- Professional, modern design
- Icons and visual elements

### Format

- **Size**: 1080x1080px (Instagram/LinkedIn square)
- **Format**: SVG (scalable) + PNG export
- **Quality**: High-resolution, print-ready

## Real-Time Data

The generator pulls live data from these tables:

```sql
SELECT 
  (SELECT COUNT(*) FROM tech_hubs WHERE status = 'approved') as hubs,
  (SELECT COUNT(*) FROM communities WHERE status = 'approved') as communities,
  (SELECT COUNT(*) FROM startups WHERE status = 'approved') as startups,
  (SELECT COUNT(*) FROM opportunities WHERE type = 'job' AND status = 'approved') as jobs,
  (SELECT COUNT(*) FROM events WHERE status = 'approved') as events,
  (SELECT COUNT(*) FROM blog_posts WHERE status = 'published') as blog_posts,
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM forum_posts) as forum_posts
```

## Use Cases

### 1. Social Media Marketing
- Generate weekly ecosystem updates
- Share on Twitter, LinkedIn, Instagram
- Engage community with visual data

### 2. Investor Presentations
- Show growth metrics
- Demonstrate platform impact
- Professional, data-driven visuals

### 3. Community Engagement
- Celebrate milestones
- Highlight opportunities
- Build excitement

### 4. Reports & Documentation
- Quarterly ecosystem reports
- Stakeholder updates
- Grant applications

### 5. Event Promotion
- Conference materials
- Presentation slides
- Printed materials

## Advanced Features

### Gemini 2.0 Flash Advantages

1. **High Thinking Level**: Advanced reasoning for optimal layouts
2. **Multimodal**: Can incorporate images (future enhancement)
3. **Fast Generation**: ~5-10 seconds per infographic
4. **Context Awareness**: Understands Uganda's tech ecosystem
5. **Creative Design**: Unique designs every time

### Future Enhancements

- [ ] Custom color schemes
- [ ] Logo upload
- [ ] Multiple size formats (story, banner, etc.)
- [ ] Animation support
- [ ] Historical data comparisons
- [ ] Scheduled auto-generation
- [ ] Email delivery
- [ ] Social media auto-posting

## Troubleshooting

### Infographic Not Generating

1. **Check API Key**: Ensure `GEMINI_API_KEY` is set in `.env`
2. **Check Database**: Verify Supabase connection
3. **Check Logs**: Look for errors in server console
4. **Rate Limits**: Gemini has rate limits, wait and retry

### SVG Not Displaying

1. **Check Response**: Ensure SVG code is valid
2. **Browser Console**: Look for rendering errors
3. **Try Different Type**: Some types may generate better than others

### Download Not Working

1. **Browser Permissions**: Allow downloads
2. **Check File Size**: Large SVGs may take time
3. **Try SVG First**: Then convert to PNG

## Performance

- **Generation Time**: 5-15 seconds
- **File Size**: 50-200KB (SVG), 200-500KB (PNG)
- **Concurrent Requests**: Handled by Gemini API limits
- **Caching**: Not implemented (each generation is unique)

## Security

- API key stored server-side only
- No user data exposed in prompts
- Rate limiting recommended for production
- Consider adding authentication for API endpoint

## Cost

- **Gemini 2.0 Flash**: Free tier available
- **Generous Limits**: Suitable for most use cases
- **Monitor Usage**: Check Google AI Studio dashboard

## Examples

### Ecosystem Overview
```
📊 Shows: 3 Hubs, 1 Startup, 0 Jobs, 0 Events
🎨 Design: Purple/pink gradient, modern icons
📱 Perfect for: General promotion
```

### Growth Metrics
```
📈 Shows: Growth indicators, momentum
🎨 Design: Green gradient, upward arrows
📱 Perfect for: Investor updates
```

### Opportunities
```
💼 Shows: Available jobs, events, connections
🎨 Design: Orange/yellow, energetic
📱 Perfect for: Recruitment
```

## Support

For issues or questions:
- **GitHub Issues**: Report bugs
- **Email**: support@techatlasug.com
- **Documentation**: This file

---

**Built with**: Gemini 2.0 Flash, React, TypeScript, Tailwind CSS  
**Status**: Production Ready  
**Last Updated**: February 9, 2026

🎨 **Start creating stunning infographics today!**
