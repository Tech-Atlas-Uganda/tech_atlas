# AI Resource Agent - Quick Guide

## Overview
The AI Resource Agent automatically searches the internet using Google Search and fills learning resource forms with relevant content for Ugandan tech learners.

## Features
- 🤖 **AI-Powered Search**: Uses Gemini 3 Flash with Google Search grounding
- 🎯 **Smart Filtering**: Focuses on free/affordable resources where Ugandans can participate
- 🚫 **Duplicate Prevention**: Tracks submission history to avoid duplicates
- ✅ **Auto-Fill Forms**: Automatically fills all form fields with structured data
- 🇺🇬 **Uganda-Focused**: Prioritizes resources relevant for Ugandan learners

## How to Use

### 1. Access the Agent
- Go to `/learning` page
- Find the **AI Resource Agent** card (purple gradient)

### 2. Search for Resources
Enter queries like:
- "free coding courses for Ugandans"
- "Python bootcamps for beginners"
- "web development tutorials"
- "tech opportunities in Uganda"
- "free data science courses"

### 3. Review & Submit
- AI finds ONE resource at a time
- Review the auto-filled data in the popup
- Click "Submit Resource" to add it
- Resource appears immediately on the platform

## What the AI Fills

The agent automatically fills these fields:
- **Title**: Resource name
- **Description**: Detailed description
- **Type**: Course, Tutorial, Book, Video, Bootcamp, Workshop
- **Category**: Web Development, Mobile, Data Science, AI/ML, etc.
- **Level**: Beginner, Intermediate, Advanced
- **Provider**: Platform or author name
- **URL**: Direct link to resource
- **Cost**: Free, Paid, or Freemium
- **Duration**: Time commitment (e.g., "6 weeks", "Self-paced")
- **Tags**: Relevant keywords
- **Relevance**: Why it's good for Ugandan learners

## API Endpoints

### Search and Auto-Fill
```
POST /api/ai-resource-agent/search-and-fill
Body: { "query": "your search query" }
```

### Get History
```
GET /api/ai-resource-agent/history
```

### Clear History (Testing)
```
POST /api/ai-resource-agent/clear-history
```

## Technical Details

### Backend
- **File**: `server/routes/ai-resource-agent.ts`
- **Model**: `gemini-3-flash-preview`
- **Tools**: Google Search grounding
- **Database**: Supabase (checks for duplicates)

### Frontend
- **Component**: `client/src/components/AIResourceAgent.tsx`
- **Page**: Integrated in `/learning` page
- **UI**: Purple gradient card with search input

### Configuration
- Requires `GEMINI_API_KEY` in `.env` file
- Uses same API key as infographic and blog image generators

## Duplicate Prevention

The agent prevents duplicates by:
1. Checking existing resources in database
2. Maintaining in-memory submission history
3. Comparing titles and URLs
4. Warning user if resource already exists

## Best Practices

### Good Queries
✅ "free Python courses"
✅ "web development bootcamps for beginners"
✅ "tech scholarships for Africans"
✅ "JavaScript tutorials"

### Avoid
❌ Too vague: "courses"
❌ Too specific: "React course by John Doe on Udemy section 5"
❌ Non-tech: "cooking classes"

## Future Enhancements

Planned features:
- [ ] Batch processing (multiple resources at once)
- [ ] Scheduled auto-discovery (daily/weekly)
- [ ] Similar agents for Events and Ecosystem entries
- [ ] Persistent history in database
- [ ] Admin dashboard for agent activity
- [ ] Quality scoring for found resources

## Troubleshooting

### "API key not configured"
- Check `.env` file has `GEMINI_API_KEY`
- Restart server after adding key

### "Resource already exists"
- Agent found a duplicate
- Try a different search query
- Clear history if testing: `POST /api/ai-resource-agent/clear-history`

### "Search failed"
- Check internet connection
- Verify Gemini API key is valid
- Check server logs for details

## Example Workflow

1. User visits `/learning` page
2. Sees AI Resource Agent card
3. Types: "free web development courses"
4. Clicks "Find" button
5. AI searches internet with Google Search
6. AI finds relevant course (e.g., freeCodeCamp)
7. Popup shows auto-filled form data
8. User reviews and clicks "Submit Resource"
9. Resource appears on learning page immediately
10. Repeat with different queries

## Notes

- Resources are auto-approved (anonymous submission)
- Moderators can review and remove inappropriate content
- Agent searches ONE resource at a time for quality control
- History resets on server restart (in-memory storage)
- Uses same Gemini API quota as other AI features

---

**Created**: February 2026
**Status**: ✅ Active
**Model**: Gemini 3 Flash Preview with Google Search
