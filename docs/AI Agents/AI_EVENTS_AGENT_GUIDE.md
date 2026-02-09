# AI Events & Opportunities Agent - Quick Guide

## Overview
The AI Events & Opportunities Agent automatically searches the internet using Google Search and fills event and opportunity submission forms with relevant content for the Ugandan tech community.

## Features
- 🤖 **AI-Powered Search**: Uses Gemini 3 Flash with Google Search grounding
- 📅 **Events**: Finds meetups, conferences, workshops, hackathons, webinars
- 🏆 **Opportunities**: Finds grants, fellowships, scholarships, competitions
- 🎯 **Smart Filtering**: Focuses on Uganda-relevant content
- 🚫 **Duplicate Prevention**: Tracks submission history
- ✅ **Auto-Fill Forms**: Automatically fills all form fields
- 🇺🇬 **Uganda-Focused**: Prioritizes accessible opportunities

## How to Use

### 1. Access the Agent
- Go to `/events` page
- Find the **AI Events & Opportunities Agent** card (purple gradient)
- Located right after the header buttons

### 2. Choose Type
- **Events Tab**: For meetups, conferences, workshops, hackathons
- **Opportunities Tab**: For grants, fellowships, scholarships, competitions

### 3. Search for Content

#### Events Queries
- "tech meetups in Kampala"
- "upcoming AI hackathons in Africa"
- "web development workshops"
- "virtual tech conferences"

#### Opportunities Queries
- "tech grants for African startups"
- "coding scholarships for students"
- "developer fellowships"
- "startup accelerators in Africa"

### 4. Review & Submit
- AI finds ONE item at a time
- Review the auto-filled data in the popup
- Click "Submit Event" or "Submit Opportunity"
- Item appears immediately on the platform

## What the AI Fills

### For Events
- **Title**: Event name
- **Description**: Detailed description and agenda
- **Type**: Meetup, Workshop, Conference, Hackathon, Webinar, Networking
- **Category**: Web Dev, Mobile, Data Science, AI/ML, etc.
- **Start Date**: Event start date and time (ISO format)
- **End Date**: Event end date and time (optional)
- **Location**: Venue name and address (if physical)
- **Virtual**: True/False (virtual or in-person)
- **URL**: Registration or event page
- **Organizer**: Organization or person name
- **Capacity**: Maximum attendees (optional)
- **Tags**: Relevant keywords
- **Relevance**: Why it's good for Ugandan tech community

### For Opportunities
- **Title**: Opportunity name
- **Description**: Detailed description and benefits
- **Type**: Grant, Fellowship, Scholarship, Competition, Accelerator, Incubator
- **Category**: Web Dev, Mobile, Data Science, AI/ML, etc.
- **Provider**: Organization providing the opportunity
- **Amount**: Funding amount (optional)
- **Currency**: USD, UGX, EUR, GBP
- **Deadline**: Application deadline (YYYY-MM-DD)
- **URL**: Application page
- **Tags**: Relevant keywords
- **Relevance**: Why it's good for Ugandan tech community

## API Endpoints

### Search and Auto-Fill
```
POST /api/ai-events-agent/search-and-fill
Body: { 
  "query": "your search query",
  "type": "event" | "opportunity"
}
```

### Get History
```
GET /api/ai-events-agent/history
```

### Clear History (Testing)
```
POST /api/ai-events-agent/clear-history
```

## Technical Details

### Backend
- **File**: `server/routes/ai-events-agent.ts`
- **Model**: `gemini-3-flash-preview`
- **Tools**: Google Search grounding
- **Database**: Supabase (checks for duplicates)

### Frontend
- **Component**: `client/src/components/AIEventsAgent.tsx`
- **Page**: Integrated in `/events` page
- **UI**: Purple gradient card with tabs for Events/Opportunities

### Configuration
- Requires `GEMINI_API_KEY` in `.env` file
- Uses same API key as other AI features

## Duplicate Prevention

The agent prevents duplicates by:
1. Checking existing events/opportunities in database
2. Maintaining in-memory submission history
3. Comparing titles
4. Warning user if item already exists

## Best Practices

### Good Event Queries
✅ "tech meetups in Kampala"
✅ "AI hackathons in East Africa"
✅ "web development workshops"
✅ "virtual tech conferences 2026"

### Good Opportunity Queries
✅ "tech grants for African startups"
✅ "coding scholarships for Ugandan students"
✅ "developer fellowships"
✅ "startup accelerators accepting applications"

### Avoid
❌ Too vague: "events", "opportunities"
❌ Too specific: "John's meetup on Tuesday"
❌ Past events: "2020 conference"
❌ Non-tech: "cooking classes"

## Example Workflows

### Finding an Event
1. User visits `/events` page
2. Clicks "Events" tab in AI agent card
3. Types: "tech meetups in Kampala"
4. Clicks "Find" button
5. AI searches internet with Google Search
6. AI finds relevant meetup (e.g., "Kampala Tech Meetup")
7. Popup shows auto-filled form data
8. User reviews and clicks "Submit Event"
9. Event appears on events page immediately

### Finding an Opportunity
1. User visits `/events` page
2. Clicks "Opportunities" tab in AI agent card
3. Types: "tech grants for African startups"
4. Clicks "Find" button
5. AI searches internet with Google Search
6. AI finds relevant grant (e.g., "Google for Startups Africa Fund")
7. Popup shows auto-filled form data
8. User reviews and clicks "Submit Opportunity"
9. Opportunity appears on events page immediately

## Troubleshooting

### "API key not configured"
- Check `.env` file has `GEMINI_API_KEY`
- Restart server after adding key

### "Search failed"
- Check internet connection
- Verify Gemini API key is valid
- Check server logs for details

### "Event/Opportunity already exists"
- Agent found a duplicate
- Try a different search query
- Clear history if testing: `POST /api/ai-events-agent/clear-history`

### "Invalid date format"
- AI should return ISO format dates
- Check server logs for parsing errors
- Try a different query

## Notes

- Items are auto-approved (anonymous submission)
- Moderators can review and remove inappropriate content
- Agent searches ONE item at a time for quality control
- History resets on server restart (in-memory storage)
- Uses same Gemini API quota as other AI features
- Focuses on upcoming events and open opportunities

## Future Enhancements

Planned features:
- [ ] Batch processing (multiple items at once)
- [ ] Scheduled auto-discovery (daily/weekly)
- [ ] Calendar integration
- [ ] Email notifications for new opportunities
- [ ] Persistent history in database
- [ ] Admin dashboard for agent activity
- [ ] Quality scoring for found items
- [ ] Auto-categorization improvements

---

**Created**: February 2026
**Status**: ✅ Active
**Model**: Gemini 3 Flash Preview with Google Search
**Location**: `/events` page
