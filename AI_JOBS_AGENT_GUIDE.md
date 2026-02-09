# AI Jobs Agent - Quick Guide

## ✅ Complete!

The AI Jobs Agent is now live on the Jobs page, automatically searching and filling tech job opportunities for Ugandan professionals.

---

## 📍 Location

**Page**: `/jobs` (Jobs & Gigs page)
**Position**: Between header buttons and tabs
**Color**: Blue gradient card

---

## 🎯 What It Does

- 🤖 **AI-Powered Search**: Uses Gemini 3 Flash with Google Search
- 💼 **Finds Tech Jobs**: Software, data, design, and more
- 🇺🇬 **Uganda-Focused**: Jobs in Uganda or remote positions for Ugandans
- ✅ **Auto-Fill**: Fills all 15+ job fields automatically
- 🚫 **No Duplicates**: Checks database and tracks history

---

## 📋 Fields Auto-Filled

The AI agent fills these fields:

1. **Title** - Job title (e.g., "Senior Software Engineer")
2. **Company** - Company name
3. **Description** - Detailed job description
4. **Requirements** - Required skills and qualifications
5. **Responsibilities** - Key duties
6. **Type** - full-time, part-time, internship, contract
7. **Location** - City, Country (or "Remote")
8. **Remote** - true/false
9. **Experience Level** - Entry, Mid, Senior, Lead
10. **Salary Min** - Minimum salary (optional)
11. **Salary Max** - Maximum salary (optional)
12. **Currency** - UGX, USD, EUR, GBP
13. **Application URL** - Where to apply
14. **Application Email** - Email for applications (optional)
15. **Expires At** - Application deadline (optional)
16. **Relevance** - Why it's good for Ugandans

---

## 🚀 How to Use

### Step 1: Go to Jobs Page
```
http://localhost:3000/jobs
```

### Step 2: Find the AI Agent
- Look for the blue gradient card
- Title: "AI Jobs Agent"
- Icon: ✨ Sparkles

### Step 3: Enter Search Query
Examples:
- "software engineer jobs in Kampala"
- "remote developer positions for Africans"
- "data science jobs in Uganda"
- "frontend developer remote jobs"

### Step 4: Click "Find"
- AI searches the internet
- Finds ONE relevant job
- Shows popup with auto-filled data

### Step 5: Review & Submit
- Check all the details
- Click "Submit Job"
- Job appears on the page immediately!

---

## 💡 Example Queries

### Location-Based
```
✅ "software engineer jobs in Kampala"
✅ "tech jobs in Uganda"
✅ "developer positions in Entebbe"
```

### Remote Jobs
```
✅ "remote developer jobs for Africans"
✅ "remote software engineer positions"
✅ "work from home tech jobs"
```

### Specific Roles
```
✅ "frontend developer jobs"
✅ "data scientist positions"
✅ "UI/UX designer jobs"
✅ "DevOps engineer opportunities"
```

### Experience Level
```
✅ "entry level developer jobs"
✅ "senior software engineer positions"
✅ "junior developer jobs in Uganda"
```

---

## 🎨 UI Design

### Card Appearance
- **Background**: Blue to indigo to purple gradient
- **Border**: Blue (200 in light, 800 in dark)
- **Icon**: ✨ Sparkles (blue)
- **Button**: Blue to indigo gradient

### Modal Popup
Shows all job details:
- Job title and company
- Type, experience, location badges
- Salary range
- Description, requirements, responsibilities
- Application URL and email
- Deadline
- Relevance explanation

---

## 🔧 Technical Details

### Backend
- **File**: `server/routes/ai-jobs-agent.ts`
- **Model**: `gemini-3-flash-preview`
- **Tools**: Google Search grounding
- **Database**: Supabase (checks for duplicates)

### Frontend
- **Component**: `client/src/components/AIJobsAgent.tsx`
- **Page**: Integrated in `/jobs` page
- **UI**: Blue gradient card

### API Endpoints
```
POST /api/ai-jobs-agent/search-and-fill
GET  /api/ai-jobs-agent/history
POST /api/ai-jobs-agent/clear-history
```

---

## 🚫 Duplicate Prevention

The agent prevents duplicates by:
1. Fetching existing jobs from database
2. Creating list of "Title at Company" combinations
3. Checking in-memory submission history
4. Warning user if job already exists

---

## ✅ Benefits

- ✅ **Fast**: Find jobs in seconds
- ✅ **Accurate**: AI extracts all relevant details
- ✅ **Uganda-Focused**: Prioritizes accessible jobs
- ✅ **No Manual Entry**: All fields auto-filled
- ✅ **Quality Control**: One job at a time
- ✅ **Always Fresh**: Real-time internet search

---

## 📊 What Gets Posted

When you submit a job via AI agent:
- ✅ Status: Auto-approved
- ✅ Visible immediately on jobs page
- ✅ Searchable and filterable
- ✅ Full job details displayed
- ✅ Application links working

---

## 🐛 Troubleshooting

### "API key not configured"
- Check `.env` has `GEMINI_API_KEY`
- Restart server after adding key

### "Search failed"
- Check internet connection
- Verify Gemini API key is valid
- Check server logs for details

### "Job already exists"
- Agent found a duplicate
- Try a different search query
- Clear history if testing

### No results found
- Try broader search terms
- Check if query is tech-related
- Try different keywords

---

## 🎯 Best Practices

### Good Queries
✅ Specific role + location
✅ Include "remote" if needed
✅ Mention experience level
✅ Use tech-related terms

### Avoid
❌ Too vague: "jobs"
❌ Non-tech: "sales jobs"
❌ Too specific: "John's company hiring"

---

## 📈 Success Metrics

After implementation:
- ✅ AI Jobs Agent live on `/jobs`
- ✅ 15+ fields auto-filled
- ✅ Duplicate prevention working
- ✅ Uganda-focused results
- ✅ One-click submission

---

## 🎉 Result

A powerful AI agent that:
- Searches the internet for tech jobs
- Finds Uganda-relevant opportunities
- Auto-fills all job details
- Prevents duplicates
- Makes job posting effortless!

---

**Status**: ✅ Complete and ready
**Location**: `/jobs` page
**Model**: Gemini 3 Flash Preview with Google Search
**Date**: February 10, 2026
