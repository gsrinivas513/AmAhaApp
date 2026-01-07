---
sidebar_position: 1
title: Overview
---

# Admin & Content Creation Overview

The Admin Panel is where educators and administrators create, manage, and monitor content on AmAha.

## What is the Admin Panel?

The Admin Panel is a specialized interface for:
- **Educators:** Create and assign content
- **Administrators:** Manage platform, users, analytics
- **Content Creators:** Build quizzes, puzzles, activities

**Access:** By invitation only  
**Role-based:** Different permissions per user type  
**Purpose:** Easy, no-code content creation

---

## User Roles & Permissions

### Educator Role

**Permissions:**
- ✓ Create quizzes (for own classes)
- ✓ Assign content to classes
- ✓ View student progress
- ✓ Create class groups
- ✓ Download student reports
- ✗ Edit existing quizzes
- ✗ Access analytics dashboard
- ✗ Manage other users

**Access:** `/admin/educator` dashboard

### Content Creator Role

**Permissions:**
- ✓ Create all content types
- ✓ Publish content (after approval)
- ✓ Edit own content
- ✓ View content analytics
- ✓ Manage content collections
- ✗ Delete published content
- ✗ Access student data
- ✗ Assign to classes

**Access:** `/admin/creator` dashboard

### Administrator Role

**Permissions:**
- ✓ Full platform access
- ✓ Manage users & roles
- ✓ View all analytics
- ✓ Publish/reject content
- ✓ Manage collections
- ✓ Access reports
- ✓ System settings
- ✓ Content moderation

**Access:** `/admin/administrator` dashboard

---

## Admin Dashboard Overview

```
┌──────────────────────────────────────────┐
│ Admin Portal - Educator View             │
├──────────────────────────────────────────┤
│                                          │
│ Welcome Back, Sarah Chen!                │
│                                          │
│ Quick Stats:                             │
│ • Classes: 4 (125 students total)        │
│ • Content Created: 23 quizzes            │
│ • This Week: 8 assignments active        │
│                                          │
├──────────────────────────────────────────┤
│ Quick Actions:                           │
│ [+ New Quiz] [+ New Class] [View Class]  │
├──────────────────────────────────────────┤
│ My Classes:                              │
│ • Period 1 Biology (31 students)         │
│ • Period 3 Biology (28 students)         │
│ • Period 4 Chemistry (32 students)       │
│ • Honors Biology (34 students)           │
├──────────────────────────────────────────┤
│ Recent Activity:                         │
│ • 12 students completed photosynthesis   │
│ • Quiz: Cell Structure (avg 82%)         │
│ • 3 students need help (flagged)         │
└──────────────────────────────────────────┘
```

---

## Main Admin Features

### 1. **Content Creation**

Easy no-code tools for creating learning content.

**Available Types:**
- Quizzes (all 11 types)
- Puzzles (all 13+ types)
- Activities (all 4 types)
- Collections (group related content)
- Learning Paths (sequences)

**Creation Flow:**
```
[Start Creating] → [Type Selection] → [Content Builder]
    → [Add Questions/Puzzles] → [Set Difficulty Levels]
    → [Add Metadata] → [Preview] → [Publish]
```

### 2. **Class Management**

Organize students and assign content.

**Features:**
- Create/manage classes
- Add students (manual or roster import)
- View student list
- Track progress per student
- Create assignments
- Monitor submission status

### 3. **Content Management**

Organize and track all created content.

**Features:**
- View all created content
- Edit content details
- Delete unpublished items
- Organize into collections
- Track usage/popularity
- Publish/unpublish items

### 4. **Student Analytics**

Monitor learning progress and outcomes.

**Features:**
- Per-student overview
- Class-wide statistics
- Assignment analytics
- Performance trends
- Skill gaps identification
- Comparative reporting

### 5. **Settings & Preferences**

Customize admin experience.

**Features:**
- Account settings
- Class templates
- Content defaults
- Notification preferences
- Privacy settings
- Integration options

---

## Content Creation Workflow

### Step 1: Select Content Type

```
[What do you want to create?]

┌──────────────────────────────────┐
│ Quizzes                          │
│ ✓ Multiple choice                │
│ ✓ True/False                     │
│ ✓ Fill in blank                  │
│ ✓ Matching & more                │
│ [Create Quiz]                    │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Puzzles                          │
│ ✓ Sudoku, Jigsaw, Crossword      │
│ ✓ Word search, Tangram & more    │
│ [Create Puzzle]                  │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Activities                       │
│ ✓ Ordering, Matching             │
│ ✓ Free-play, Memory              │
│ [Create Activity]                │
└──────────────────────────────────┘
```

### Step 2: Content Builder

**Quiz Builder Example:**

```
[New Quiz]
├─ Basic Info:
│  ├─ Title: [__________ ]
│  ├─ Description: [____________]
│  ├─ Subject: [Biology▼]
│  ├─ Grade Level: [6-8▼]
│  └─ Tags: [Add tags...]
│
├─ Questions:
│  ├─ Question 1 (MCQ)
│  │  ├─ Text: [__________]
│  │  ├─ Options:
│  │  │  ├─ ☑ Option A
│  │  │  ├─ ○ Option B
│  │  │  ├─ ○ Option C
│  │  │  └─ ○ Option D
│  │  ├─ Correct: [Option A▼]
│  │  ├─ Explanation: [__________]
│  │  ├─ Hint: [__________]
│  │  └─ [+] Add Image/Audio
│  │
│  ├─ [+ Add Question]
│  └─ [+ Add Another Type]
│
└─ Difficulty Variants:
   ├─ Easy: [Select questions] (3-5)
   ├─ Medium: [Select questions] (4-6)
   ├─ Hard: [Select questions] (5-7)
   └─ Expert: [Select questions] (5-8)
```

### Step 3: Set Metadata & Difficulty

```
[Quiz Metadata]
├─ Difficulty Level: [Medium▼]
├─ Average Time: [10-15 minutes]
├─ Learning Objectives:
│  ├─ [ ] Photosynthesis process
│  ├─ [ ] Plant structures
│  └─ [+ Add more]
│
├─ Content Standards (CCSS):
│  ├─ [Add standards...]
│
├─ Images/Media:
│  ├─ Featured image: [Upload]
│  └─ [Add more media]
│
└─ Visibility:
   ├─ Status: [Draft▼]
   ├─ Share with: [Only me▼]
   └─ [Make public when ready]
```

### Step 4: Preview & Publish

```
[Preview]
├─ See exactly how content looks
├─ Test interactivity
├─ Check on mobile
└─ [Edit] [Publish]
    ↓
[Publish Options]
├─ Status: [Published▼]
├─ Visibility: [Public▼] [Friends▼] [Private]
├─ Searchable: ☑ Yes
├─ Allow Downloads: ☑ Yes
└─ [Publish Now] [Schedule] [Save as Draft]
    ↓
[Confirmation]
├─ ✓ Published successfully!
├─ Public link: [Link provided]
├─ [Share] [View Stats] [Back to Dashboard]
└─ [Create Another]
```

---

## Assignment Management

### Creating an Assignment

```
[Assign Content to Class]
├─ Class: [Biology Period 1▼] (28 students)
│
├─ Content Selection:
│  ├─ Type: [Quizzes▼]
│  ├─ [Browse Your Content]
│  ├─ Selected: "Photosynthesis Quiz"
│  └─ Preview: [Show/Hide]
│
├─ Assignment Details:
│  ├─ Due Date: [Date Picker]
│  ├─ Due Time: [Time Picker]
│  ├─ Instructions: [Text Editor]
│  ├─ Difficulty Level: [Easy▼] (Can override)
│  ├─ Allow Retakes: [Yes▼] (unlimited)
│  └─ Points: [Auto-calculate] or [Manual entry]
│
├─ Notifications:
│  ├─ ☑ Notify students when assigned
│  ├─ ☑ Remind before due date
│  └─ ☑ Notify when submitted
│
└─ [Preview] [Assign Now] [Schedule for Later]
```

### Monitoring Submissions

```
[Assignment: Photosynthesis Quiz]
├─ Class: Biology Period 1
├─ Due: Tomorrow at 11:59 PM
├─ Status: In Progress
│  ├─ Submitted: 12/28 (43%)
│  ├─ In Progress: 14/28 (50%)
│  ├─ Not Started: 2/28 (7%)
│
├─ Student List:
│  ├─ ✓ Emma Zhang (92%) - Submitted 10:45 AM
│  ├─ ✓ Liam Johnson (78%) - Submitted 11:20 AM
│  ├─ ⏳ Sarah Chen (in progress...)
│  ├─ ○ Mike Davis (not started)
│  └─ [Show more students...]
│
├─ Class Statistics:
│  ├─ Average Score: 82%
│  ├─ High Score: 98% (Emma)
│  ├─ Low Score: 65% (Mike)
│  └─ [View Detailed Report]
│
└─ Actions:
   ├─ [Email reminders] [Extend due date]
   └─ [View analytics] [Download grades]
```

---

## Analytics & Reporting

### Assignment Analytics

```
[Assignment Report: Photosynthesis Quiz]
├─ Submission Stats:
│  ├─ Submitted: 28/28 (100%)
│  ├─ On-time: 26/28 (93%)
│  ├─ Late: 2/28 (7%)
│
├─ Performance:
│  ├─ Average: 82% (Excellent!)
│  ├─ Distribution:
│  │  ├─ A (90-100%): 18 students
│  │  ├─ B (80-89%): 7 students
│  │  ├─ C (70-79%): 2 students
│  │  └─ Below 70%: 1 student
│  └─ [Grade Histogram Chart]
│
├─ Question Analytics:
│  ├─ Q1: 96% correct (✓ Most got it)
│  ├─ Q2: 68% correct (⚠ Many struggled)
│  ├─ Q3: 89% correct (✓ Good)
│  ├─ Q4: 71% correct (⚠ Difficult)
│  └─ Q5: 93% correct (✓ Most got it)
│
├─ Time Tracking:
│  ├─ Average: 11 min 45 sec
│  ├─ Fastest: 4 min 22 sec
│  ├─ Slowest: 28 min 14 sec
│
└─ Recommendations:
   ├─ "Consider reteaching Q2 & Q4"
   ├─ "Follow up with [2 students] who need help"
   └─ [Assign follow-up content]
```

---

## Content Management

### Viewing Created Content

```
[My Content Library]
├─ Filters:
│  ├─ Type: [All▼] [Quiz] [Puzzle] [Activity]
│  ├─ Status: [Published▼] [Draft]
│  ├─ Subject: [All▼]
│  └─ Sort: [Recently Modified▼]
│
├─ Content List:
│  ├─ "Photosynthesis Quiz"
│  │  ├─ Type: Quiz (MCQ)
│  │  ├─ Status: Published
│  │  ├─ Created: 2024-01-10
│  │  ├─ Uses: 154 (students completed)
│  │  ├─ Rating: 4.5/5
│  │  └─ [Edit] [Duplicate] [Delete] [Share]
│  │
│  ├─ "Cell Structure Quiz"
│  │  └─ [Similar actions...]
│  │
│  └─ [Show more...]
│
└─ [+ Create New Content]
```

---

## Key Admin Features

### Content Approval (Admin Only)

```
[Content Review Queue]
├─ Pending Review: 5 items
│  ├─ "Advanced Biology Quiz" (Sarah Chen)
│  │  ├─ Status: Awaiting review
│  │  ├─ Submitted: 2 hours ago
│  │  ├─ Quality Score: 85/100
│  │  └─ [Review] [Preview]
│  │
│  └─ [Show more pending...]
│
├─ Recently Approved: 12 items
├─ Rejected: 0 items
│
└─ [Review Content] [Set Standards]
```

### User Management (Admin Only)

```
[User Management]
├─ Total Users: 45,000+
├─ Recent Sign-ups: 234 this week
│
├─ By Role:
│  ├─ Students: 43,500
│  ├─ Educators: 1,200
│  ├─ Creators: 150
│  └─ Admins: 12
│
└─ [View Users] [Add Role] [Manage Permissions]
```

---

## Best Practices for Educators

✓ **DO:**
- Create clear, specific quiz titles
- Use difficulty levels meaningfully
- Provide good explanations for answers
- Give feedback that encourages students
- Monitor student progress regularly
- Use analytics to inform reteaching
- Create follow-up content for struggles

✗ **DON'T:**
- Make content too difficult initially
- Overload assignments at end of unit
- Create content and forget about it
- Ignore students who struggle
- Copy content without crediting sources
- Publish unreviewed content
- Change assignments after due date without notice

---

**Next:** [Quiz Management](quiz-management)
