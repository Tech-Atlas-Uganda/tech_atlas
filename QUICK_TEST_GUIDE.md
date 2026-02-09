# Quick Test Guide - Tech Atlas Algolia Integration

## 🚀 Start the Application

```bash
# Make sure you're in the project root
cd tech_atlas

# Start the development server (if not running)
pnpm dev

# Server should start on http://localhost:3002
```

## ✅ Test Checklist

### 1. Search Bar (Non-Conversational Experience)

#### Visual Check
- [ ] Search bar visible at top of homepage
- [ ] Glassmorphism effect (frosted glass look)
- [ ] Gradient glow border visible
- [ ] Animated typing cycling through phrases

#### Interaction Check
- [ ] Hover over search bar → animation pauses
- [ ] Hover → sparkle icon appears
- [ ] Hover → glow intensifies
- [ ] Click → search bar gets focus
- [ ] Click → results dropdown appears

#### Search Functionality
```
Test Query 1: "Kampala"
Expected: 4 results (Starthub Africa, MIICHub, Tech Atlas, MpaMpe)

Test Query 2: "Innovation"
Expected: 2 results (Innovation Village, MIICHub)

Test Query 3: "startup"
Expected: 1 result (Starthub Africa)

Test Query 4: "MpaMpe"
Expected: 1 result (MpaMpe startup)
```

#### Debug Panel Check
- [ ] Shows current query
- [ ] Shows index name: "tech_atlas_new"
- [ ] Shows number of results
- [ ] Shows status (Focused/Showing results)

### 2. AI Chatbot (Conversational Experience)

#### Visual Check
- [ ] Floating button visible in bottom-right corner
- [ ] Button has gradient (purple to pink)
- [ ] Pulsing ring animation around button
- [ ] Message circle icon visible

#### Button Interaction
- [ ] Hover → button scales up (1.1x)
- [ ] Click → button disappears
- [ ] Click → chat window opens with animation
- [ ] Chat window: 400px × 600px
- [ ] Glassmorphism effect on chat window

#### Chat Window Check
- [ ] Header shows "Tech Atlas AI"
- [ ] Subtitle: "Your ecosystem guide"
- [ ] Close button (X) in top-right
- [ ] Welcome message displayed
- [ ] Input field at bottom
- [ ] Send button visible
- [ ] Quick action buttons visible

#### Chat Functionality
```
Test 1: System Info
Type: "What is Tech Atlas?"
Expected: Explanation of the platform

Test 2: Search Query
Type: "Tech hubs in Kampala"
Expected: 
  - Response message
  - 3 result cards (Starthub, MIICHub, MpaMpe)
  - Each card clickable

Test 3: Quick Actions
Click: "Tech hubs in Kampala" button
Expected: Input field fills with text

Test 4: Result Cards
Click: Any result card
Expected: Navigate to detail page (URL changes)
```

#### Message Display Check
- [ ] User messages: right-aligned, gradient background
- [ ] Assistant messages: left-aligned, muted background
- [ ] Timestamps shown below messages
- [ ] Messages auto-scroll to bottom
- [ ] Result cards have images (if available)
- [ ] Result cards show location with 📍 emoji

### 3. Browser Console Check

Open DevTools (F12) and check console for:

#### Search Bar Logs
```
🎯 Search box focused
🔍 Current query: "Kampala"
🔍 Results: [Object]
🔍 Has results: true
🎯 Rendering hit: {title: "Starthub Africa", ...}
```

#### Chatbot Logs
```
(No errors should appear)
Search results should be logged when queries are made
```

### 4. Performance Check

#### Search Speed
- [ ] Results appear in < 100ms
- [ ] No lag when typing
- [ ] Smooth animations (60fps)

#### Chatbot Speed
- [ ] Opens instantly
- [ ] Messages appear smoothly
- [ ] No delay in search results

### 5. Responsive Design Check

#### Desktop (1920×1080)
- [ ] Search bar centered, max-width 672px
- [ ] Chat window 400×600px
- [ ] All elements visible

#### Tablet (768×1024)
- [ ] Search bar responsive
- [ ] Chat window adjusted
- [ ] Touch-friendly

#### Mobile (375×667)
- [ ] Search bar full-width
- [ ] Chat window full-width
- [ ] Buttons large enough to tap

## 🐛 Common Issues & Solutions

### Issue: Search returns no results
**Check:**
1. Index name is "tech_atlas_new" (not "supabase_tech_atlas_index")
2. API credentials are correct
3. Browser console for errors
4. Network tab for failed requests

**Solution:**
```bash
# Test the index directly
node test-search-direct.js

# Should show 14 records
```

### Issue: Chatbot button not visible
**Check:**
1. AlgoliaChatbot component imported in Home.tsx
2. No z-index conflicts
3. Browser console for errors

**Solution:**
Check `client/src/pages/Home.tsx` has:
```tsx
import AlgoliaChatbot from "@/components/AlgoliaChatbot";
// ...
<AlgoliaChatbot />
```

### Issue: Animations not working
**Check:**
1. Framer Motion installed
2. No CSS conflicts
3. Browser supports backdrop-filter

**Solution:**
```bash
# Reinstall dependencies
pnpm install
```

### Issue: Results dropdown not showing
**Check:**
1. Focus state is true
2. Results array has data
3. Z-index is high enough (9999)
4. No parent overflow:hidden

**Solution:**
Check browser console for `🔍` logs showing query and results.

## 📊 Expected Data

### Index: tech_atlas_new (14 records)

**Tech Hubs (3):**
- Innovation Village - Mbarara
- Starthub Africa - Kampala
- MIICHub - Kampala

**Startups (1):**
- MpaMpe - Kampala

**Users (3):**
- Admin User
- UData Labs Admin
- Tech Atlas

**Roles (6):**
- user, moderator, editor, admin, core_admin, contributor

**Forum (1):**
- Forum reply

## 🎯 Success Criteria

### Search Bar
✅ Animated typing works
✅ Search returns results
✅ Results display correctly
✅ Images load (if available)
✅ Locations show with emoji
✅ Debug panel shows info

### Chatbot
✅ Button animates
✅ Chat opens smoothly
✅ Messages display correctly
✅ Search works in chat
✅ Result cards clickable
✅ Quick actions work
✅ Close button works

### Overall
✅ No console errors
✅ Fast performance (<100ms)
✅ Responsive design
✅ Smooth animations
✅ Professional appearance

## 📸 Screenshot Checklist

Take screenshots of:
1. Homepage with search bar (idle state)
2. Search bar with results (typing "Kampala")
3. Chatbot floating button
4. Chatbot open with welcome message
5. Chatbot with search results
6. Mobile view of search bar
7. Mobile view of chatbot

## 🎥 Demo Video Script

**Duration: 30 seconds**

1. (0-5s) Show homepage with animated typing
2. (5-10s) Type "Kampala" and show results
3. (10-15s) Click chatbot button
4. (15-20s) Type query in chat
5. (20-25s) Show result cards
6. (25-30s) Click result card, show navigation

## ✅ Final Checklist

Before submitting:
- [ ] All tests pass
- [ ] No console errors
- [ ] Screenshots taken
- [ ] Demo video recorded
- [ ] Documentation complete
- [ ] Code committed to GitHub
- [ ] Ready for deployment

---

**Testing Time: ~10 minutes**  
**Last Updated: February 9, 2026**
