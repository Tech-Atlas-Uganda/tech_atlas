# AI Resource Agent - Visual Location Guide

## Where to Find It

The AI Resource Agent appears on the **Learning Hub** page at `/learning`

## Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Learning Hub                          [Share Resource]    │
│  Curated resources, bootcamps, and mentorship programs     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Search...] [All Categories ▼] [All Levels ▼]            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │ 🌟 AI Resource Agent                              │    │
│  │                                                    │    │
│  │ Let AI search the internet and auto-fill          │    │
│  │ learning resources for Ugandan tech learners      │    │
│  │                                                    │    │
│  │ [Find startups, hubs, events...] [🔍 Find]       │    │
│  │                                                    │    │
│  │ Try queries like:                                 │    │
│  │ • Free web development bootcamps                  │    │
│  │ • Python courses for beginners                    │    │
│  │ • Tech opportunities in Uganda                    │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │ Resource │  │ Resource │  │ Resource │                │
│  │   Card   │  │   Card   │  │   Card   │                │
│  └──────────┘  └──────────┘  └──────────┘                │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │ Resource │  │ Resource │  │ Resource │                │
│  │   Card   │  │   Card   │  │   Card   │                │
│  └──────────┘  └──────────┘  └──────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Visual Hierarchy

1. **Page Header** - Title and "Share Resource" button
2. **Filters** - Search, Category, Level dropdowns
3. **🌟 AI Resource Agent** ← NEW! (Purple gradient card)
4. **Resource Grid** - Existing learning resources

## Component Styling

### Card Appearance
- **Background**: Purple to pink gradient (10% opacity)
- **Border**: Purple (200 in light mode, 800 in dark mode)
- **Icon**: Sparkles (🌟) in purple
- **Button**: Gradient purple to pink
- **Animation**: Fade in from bottom

### Color Scheme
```css
Background: from-purple-500/10 to-pink-500/10
Border: border-purple-200 dark:border-purple-800
Button: from-purple-500 to-pink-500
Icon: text-purple-500
```

## User Flow

### Step 1: Initial View
```
User lands on /learning page
↓
Sees filters at top
↓
Sees AI Resource Agent card (purple gradient)
↓
Reads description and example queries
```

### Step 2: Search
```
User types query: "free Python courses"
↓
Clicks "Find" button
↓
Button shows loading spinner
↓
"Searching..." text appears
```

### Step 3: Results
```
AI finds resource
↓
Modal popup appears
↓
Shows auto-filled data:
  - Title
  - Description
  - Type, Level, Cost, Duration
  - Category, Provider, URL
  - Tags
  - Relevance explanation
```

### Step 4: Submit
```
User reviews data
↓
Clicks "Submit Resource" button
↓
Success toast appears
↓
Modal closes
↓
Resource appears in grid below
↓
Search input clears
```

## Mobile View

```
┌─────────────────────────┐
│ Learning Hub            │
│ [Share Resource]        │
├─────────────────────────┤
│ [Search...]             │
│ [All Categories ▼]      │
│ [All Levels ▼]          │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ 🌟 AI Resource      │ │
│ │    Agent            │ │
│ │                     │ │
│ │ [Search...] [Find]  │ │
│ │                     │ │
│ │ Try queries like:   │ │
│ │ • Free courses      │ │
│ │ • Python tutorials  │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ Resource Card       │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Resource Card       │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

## Modal Popup (Desktop)

```
        ┌─────────────────────────────────────────┐
        │ 🌟 AI Found a Resource                  │
        │ Review and submit this learning resource│
        ├─────────────────────────────────────────┤
        │                                         │
        │ Python for Everybody                    │
        │ Complete Python course covering...      │
        │                                         │
        │ ┌──────────┐ ┌──────────┐             │
        │ │Type      │ │Level     │             │
        │ │Course    │ │Beginner  │             │
        │ └──────────┘ └──────────┘             │
        │                                         │
        │ ┌──────────┐ ┌──────────┐             │
        │ │Cost      │ │Duration  │             │
        │ │Free      │ │8 weeks   │             │
        │ └──────────┘ └──────────┘             │
        │                                         │
        │ Category: Web Development               │
        │ Provider: Coursera                      │
        │ URL: https://coursera.org/...           │
        │                                         │
        │ Tags: python, programming, beginner     │
        │                                         │
        │ ┌─────────────────────────────────────┐ │
        │ │ Why relevant for Ugandans:          │ │
        │ │ Free course with no prerequisites   │ │
        │ └─────────────────────────────────────┘ │
        │                                         │
        │ [✓ Submit Resource] [✗ Cancel]         │
        │                                         │
        └─────────────────────────────────────────┘
```

## States

### Idle State
- Search input empty
- "Find" button enabled
- No loading indicators

### Loading State
- "Find" button shows spinner
- Text changes to "Searching..."
- Button disabled
- Input disabled

### Success State
- Modal opens
- Data displayed
- "Submit Resource" button enabled
- Success toast: "Found a resource!"

### Error State
- Error toast appears
- Modal stays closed
- Button re-enabled
- User can try again

### Duplicate State
- Warning toast: "Resource already exists"
- Modal opens anyway (for review)
- Submit button still works
- User can decide to submit or cancel

## Accessibility

- ✅ Keyboard navigation
- ✅ Screen reader friendly
- ✅ Focus indicators
- ✅ ARIA labels
- ✅ Color contrast (WCAG AA)
- ✅ Loading announcements

## Integration Points

### With Existing Features
1. **Learning Page** - Seamlessly integrated
2. **tRPC API** - Uses existing `learning.create` mutation
3. **Database** - Checks existing resources
4. **Toast System** - Uses Sonner notifications
5. **UI Components** - Uses shadcn/ui library

### With Other AI Features
1. **Infographic Generator** - Same API key
2. **Blog Image Generator** - Same API key
3. **Location Search** - Similar UI pattern

## Quick Access

### Direct URL
```
http://localhost:3000/learning
```

### Navigation Path
```
Home → Learning Hub → AI Resource Agent (visible on page)
```

### Alternative Access
```
Dashboard → Learning Hub → AI Resource Agent
```

## Tips for Users

1. **Be Specific**: "free Python courses" better than "courses"
2. **One at a Time**: Agent finds ONE resource per search
3. **Review Data**: Always check auto-filled information
4. **Try Variations**: Different queries = different results
5. **Check Duplicates**: Agent warns if resource exists

## Admin Notes

- No special permissions required
- Works for anonymous users
- Auto-approves submissions
- Moderators can review later
- History resets on server restart

---

**Location**: `/learning` page
**Position**: Between filters and resource grid
**Visibility**: Always visible (no toggle)
**Status**: ✅ Active
