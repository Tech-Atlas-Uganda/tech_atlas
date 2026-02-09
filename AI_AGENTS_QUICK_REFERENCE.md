# AI Agents - Quick Reference Card

## 🚀 All AI Agents at a Glance

---

## 📚 Learning Resources Agent
- **Page**: `/learning`
- **Tab**: Single mode
- **Query**: "free Python courses"
- **Finds**: Courses, tutorials, bootcamps
- **Image**: None
- **Button**: Purple "Find"

---

## 📅 Events Agent
- **Page**: `/events`
- **Tab**: Events (Blue)
- **Query**: "tech meetups in Kampala"
- **Finds**: Meetups, conferences, workshops, hackathons
- **Image**: Yellow/Amber gradient (📅)
- **Button**: Blue "Find"

---

## 🏆 Opportunities Agent
- **Page**: `/events`
- **Tab**: Opportunities (Green)
- **Query**: "tech grants for Africans"
- **Finds**: Grants, fellowships, scholarships, competitions
- **Image**: Green/Emerald gradient (🏆)
- **Button**: Green "Find"

---

## 📊 Quick Comparison

| Feature | Resources | Events | Opportunities |
|---------|-----------|--------|---------------|
| **Location** | /learning | /events | /events |
| **Tab** | - | Events | Opportunities |
| **Icon** | ✨ | 📅 | 🏆 |
| **Color** | Purple | Blue | Green |
| **Image** | ❌ | ✅ Yellow | ✅ Green |
| **Fields** | 10+ | 12+ | 10+ |

---

## 🎯 Example Queries

### Learning Resources
```
✅ "free Python courses for beginners"
✅ "web development bootcamps"
✅ "tech scholarships for Ugandans"
✅ "JavaScript tutorials"
✅ "data science courses"
```

### Events
```
✅ "tech meetups in Kampala"
✅ "AI hackathons in Africa"
✅ "web development workshops"
✅ "virtual tech conferences"
✅ "startup networking events"
```

### Opportunities
```
✅ "tech grants for African startups"
✅ "coding scholarships for students"
✅ "developer fellowships"
✅ "startup accelerators"
✅ "tech competitions"
```

---

## 🔧 Technical Quick Facts

### All Agents Use:
- **Model**: Gemini 3 Flash Preview
- **Tool**: Google Search grounding
- **API Key**: `GEMINI_API_KEY` from `.env`
- **Database**: Supabase
- **Duplicate Check**: ✅ Yes
- **Auto-Approve**: ✅ Yes

### API Endpoints:
```
POST /api/ai-resource-agent/search-and-fill
POST /api/ai-events-agent/search-and-fill
GET  /api/ai-resource-agent/history
GET  /api/ai-events-agent/history
```

---

## 📁 File Structure

```
server/routes/
├── ai-resource-agent.ts       ← Learning
└── ai-events-agent.ts         ← Events & Opportunities

client/src/components/
├── AIResourceAgent.tsx        ← Learning
└── AIEventsAgent.tsx          ← Events & Opportunities (with tabs)
```

---

## 🎨 Default Images

### Event Image
```
URL: https://opjxkfzofuqzijkvinzd.supabase.co/storage/v1/object/public/event-images/defaults/default-event-1770670986986.png
Color: Yellow/Amber gradient
Icon: 📅
Text: TECH ATLAS EVENT
```

### Opportunity Image
```
URL: https://opjxkfzofuqzijkvinzd.supabase.co/storage/v1/object/public/opportunity-images/defaults/default-opportunity-1770670986986.png
Color: Green/Emerald gradient
Icon: 🏆
Text: TECH ATLAS OPPORTUNITY
```

**Generate**: Open `generate-opportunity-image.html` in browser

---

## ⚡ Quick Start

### 1. Start Server
```bash
npm run dev
```

### 2. Test Learning Agent
```
1. Go to http://localhost:3000/learning
2. Find purple AI card
3. Type: "free Python courses"
4. Click "Find"
5. Review and submit
```

### 3. Test Events Agent
```
1. Go to http://localhost:3000/events
2. Find purple AI card
3. Click "Events" tab
4. Type: "tech meetups in Kampala"
5. Click "Find"
6. Review and submit
```

### 4. Test Opportunities Agent
```
1. Go to http://localhost:3000/events
2. Find purple AI card
3. Click "Opportunities" tab
4. Type: "tech grants for Africans"
5. Click "Find"
6. Review and submit
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "API key not configured" | Check `.env` has `GEMINI_API_KEY`, restart server |
| "Search failed" | Check internet connection, verify API key |
| "Already exists" | Try different query or clear history |
| "Invalid date" | AI should return ISO format, check logs |
| No image | Upload opportunity image to Supabase |

---

## 📊 Success Metrics

After implementation:
- ✅ 3 AI agents live
- ✅ 2 API endpoints
- ✅ 2 frontend components
- ✅ 30+ fields auto-filled
- ✅ 0 TypeScript errors
- ✅ Full documentation

---

## 🎉 Status

**All agents**: ✅ Complete and ready
**Next step**: Upload opportunity image and test!

---

## 📚 Full Documentation

- `AI_RESOURCE_AGENT_GUIDE.md` - Learning agent guide
- `AI_EVENTS_AGENT_GUIDE.md` - Events/opportunities guide
- `AI_AGENTS_COMPLETE_SUMMARY.md` - Complete overview
- `AI_AGENTS_LOCATIONS.md` - Visual location guide
- `UPLOAD_OPPORTUNITY_IMAGE.md` - Image upload guide

---

**Quick Tip**: Look for purple gradient cards with ✨ sparkles icon!
