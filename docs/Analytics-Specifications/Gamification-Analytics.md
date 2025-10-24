# Gamification Analytics - Complete Specification

**Document Information**
- **Service**: Learning Analytics Microservice (#8)
- **Analytics Category**: Gamification & Engagement
- **Version**: 1.0
- **Last Updated**: October 11, 2025
- **Status**: Complete Specification

---

## Overview

Gamification Analytics tracks and displays game-like metrics to enhance learner motivation and engagement. All metrics are calculated from existing data sources—no new data collection is required. The system provides achievements, badges, points, streaks, leaderboards, and AI-powered motivational messages.

### Key Features

- **Achievement Tracking**: Badges for course completions, skill acquisitions, assessment scores
- **Progress Streaks**: Login consistency, learning momentum tracking
- **Points System**: Calculated points for various learning activities
- **Leaderboards**: Privacy-preserved rankings with anonymized data
- **Progress Milestones**: Recognition for key learning achievements
- **Engagement Momentum**: Real-time engagement status indicators
- **AI-Powered Motivation**: Personalized encouragement via Google Gemini
- **Privacy-First**: Optional participation, no forced competition

---

## Gamification Metrics

### 1. Achievement Tracking

**Purpose**: Recognize and celebrate learning accomplishments with badges and achievements

#### Badge Types

**Course Master Badges:**
- **Trigger**: Course completion
- **Data Source**: Course Builder MS
- **Calculation**: Count of completed courses
- **Tiers**:
  - Bronze: 1-5 courses completed
  - Silver: 6-15 courses completed
  - Gold: 16-30 courses completed
  - Platinum: 31+ courses completed
- **Display**: Badge icon + course count + tier level

**Skill Champion Achievements:**
- **Trigger**: Skill acquisition (binary: acquired = yes)
- **Data Source**: Skills Engine MS
- **Calculation**: Count of acquired skills
- **Tiers**:
  - Apprentice: 1-10 skills acquired
  - Expert: 11-25 skills acquired
  - Master: 26-50 skills acquired
  - Grandmaster: 51+ skills acquired
- **Display**: Badge icon + skill count + tier level

**Top Performer Recognition:**
- **Trigger**: Perfect assessment scores (100/100)
- **Data Source**: Assessment MS
- **Calculation**: Count of perfect scores
- **Tiers**:
  - Achiever: 1 perfect score
  - Perfectionist: 3 perfect scores
  - Flawless: 5 perfect scores
  - Legendary: 10+ perfect scores
- **Display**: Badge icon + perfect score count + tier level

**Path Pioneer Milestones:**
- **Trigger**: Learning path completion (100% topics completed)
- **Data Source**: Learner AI MS
- **Calculation**: Count of completed learning paths
- **Tiers**:
  - Explorer: 1 path completed
  - Navigator: 2 paths completed
  - Trailblazer: 3 paths completed
  - Pathfinder: 5+ paths completed
- **Display**: Badge icon + path count + tier level

#### Data Sources
- **Course Builder MS**: Course completion data
- **Skills Engine MS**: Skill acquisition data
- **Assessment MS**: Test scores and pass/fail data
- **Learner AI MS**: Learning path progress data

---

### 2. Progress & Streaks

**Purpose**: Encourage consistency and momentum in learning activities

#### Streak Types

**Learning Streak:**
- **Trigger**: Consecutive days with login activity
- **Data Source**: Auth Service MS (login timestamps)
- **Calculation**: 
  ```javascript
  let streak = 0;
  for (let i = today; i >= 0; i--) {
    if (hasLoginOnDay(i)) {
      streak++;
    } else {
      break;
    }
  }
  ```
- **Display**: 
  - "🔥 X-day learning streak"
  - Visual calendar with streak days highlighted
  - Current streak + longest streak
- **Milestones**:
  - 7 days: "Week Warrior"
  - 30 days: "Month Master"
  - 90 days: "Quarter Champion"
  - 365 days: "Year Legend"

**Momentum Builder:**
- **Trigger**: Consecutive course completions (without gaps > 7 days)
- **Data Source**: Course Builder MS
- **Calculation**: Count consecutive course completions where completion date gap ≤ 7 days
- **Display**:
  - "📈 Momentum: X courses in a row"
  - Progress bar to next momentum milestone
- **Milestones**:
  - 3 courses: "Building Momentum"
  - 5 courses: "On a Roll"
  - 10 courses: "Unstoppable"

**Consistent Learner Status:**
- **Trigger**: Weekly activity patterns (login or course activity)
- **Data Source**: Auth Service MS, Course Builder MS
- **Calculation**: Active days per week over last 4 weeks
  ```javascript
  const activeDaysPerWeek = countActiveDays(last4Weeks) / 4;
  if (activeDaysPerWeek >= 5) return "Highly Consistent";
  if (activeDaysPerWeek >= 3) return "Consistent";
  return "Building Consistency";
  ```
- **Display**: Status badge + days active per week

**Progress Velocity:**
- **Trigger**: Course completion rate over time
- **Data Source**: Course Builder MS, Learner AI MS
- **Calculation**: 
  ```javascript
  const coursesPerMonth = completedCourses / monthsSinceStart;
  if (coursesPerMonth >= 4) return "Fast Learner ⚡";
  if (coursesPerMonth >= 2) return "Steady Learner 📚";
  return "Learning at Your Pace 🎯";
  ```
- **Display**: Badge + courses per month metric

#### Data Sources
- **Auth Service MS**: Login timestamps, session data
- **Course Builder MS**: Course completion dates
- **Learner AI MS**: Learning path progress

---

### 3. Points System

**Purpose**: Provide quantifiable progress metric across all learning activities

#### Points Calculation

**Course Completion:**
- **Points**: 100 points per course
- **Data Source**: Course Builder MS
- **Trigger**: Course status = completed
- **Rationale**: Highest value activity (comprehensive learning)

**Skill Acquired:**
- **Points**: 50 points per skill
- **Data Source**: Skills Engine MS
- **Trigger**: Skill acquisition = yes (binary)
- **Rationale**: High value (demonstrates mastery)

**Assessment Passed:**
- **Points**: Score × 1 (0-100 points based on score)
- **Data Source**: Assessment MS
- **Trigger**: Assessment completion
- **Examples**:
  - 85/100 score → 85 points
  - 100/100 score → 100 points
  - 70/100 score → 70 points
- **Rationale**: Proportional to performance

**Practice Completion:**
- **Points**: 10 points per session
- **Data Source**: DevLab MS
- **Trigger**: Practice session completed
- **Rationale**: Encourages hands-on practice

**Learning Streak Day:**
- **Points**: 5 points per day in streak
- **Data Source**: Auth Service MS (login data)
- **Trigger**: Daily login (consecutive days)
- **Rationale**: Rewards consistency

#### Total Points Formula

```javascript
totalPoints = 
  (coursesCompleted × 100) +
  (skillsAcquired × 50) +
  (sum of all assessment scores) +
  (practiceSessions × 10) +
  (streakDays × 5);
```

#### Points Display

- **Lifetime Total**: All-time accumulated points
- **Monthly Points**: Points earned this month
- **Weekly Points**: Points earned this week
- **Points Leaderboard**: Rank by total points (anonymized)
- **Points History Chart**: Line chart showing accumulation over time

#### Data Sources
- **All microservices**: Points derived from existing metrics across all services

---

### 4. Leaderboards (Privacy-Preserved)

**Purpose**: Provide competitive context while maintaining user privacy

#### Leaderboard Types

**Top Learners by Points:**
- **Metric**: Total points accumulated
- **Display**: User's percentile rank (not absolute position)
  - Example: "You're in the top 15% of learners"
  - Shows range, not exact rank
- **Anonymization**: No user names or identifiers shown
- **Aggregation**: Shows distribution (top 10%, 25%, 50%, 75%)
- **Filters**: Overall platform, within organization, within department

**Fastest Course Completions:**
- **Metric**: Average days to complete a course
- **Display**: User's completion speed vs aggregated averages
  - Example: "You complete courses 20% faster than average"
- **Anonymization**: Aggregated time-based comparison
- **No individual names**: Only percentile ranking

**Most Skills Acquired:**
- **Metric**: Count of acquired skills
- **Display**: Skill count percentile
  - Example: "You have more skills than 68% of learners"
- **Anonymization**: Count-based aggregation
- **Filters**: By competency level, organization, role

**Department/Organization Rankings:**
- **Metric**: Average points per learner in department/org
- **Display**: Team-based leaderboard (department names visible, not individuals)
  - Example: "Engineering Dept: 4,250 avg points (3rd of 12 departments)"
- **Aggregation**: Department-level only
- **Privacy**: Individual scores not shown

#### Privacy Rules

**K-Anonymity Enforcement:**
- Minimum 10 users required for any leaderboard
- If sample size < 10, show "Not enough data" message
- Prevents identification in small groups

**Anonymization:**
- No user names, emails, or identifiers
- Only show user's own rank (not others')
- Aggregated percentiles only

**Opt-Out:**
- Users can opt out of leaderboards entirely
- Opt-out still allows personal badges and points
- No penalty for opting out

#### Data Sources
- **Aggregated analytics**: From all microservices, pre-aggregated

---

### 5. Progress Milestones

**Purpose**: Celebrate key achievements with recognition messages

#### Milestone Types

**First Course Completed:**
- **Trigger**: First course completion
- **Message**: "🎉 Congratulations! You've completed your first course!"
- **Badge**: "First Steps" badge
- **Display**: Celebratory modal with confetti animation

**5 Skills Mastered:**
- **Trigger**: 5th skill acquired
- **Message**: "💪 You're building a solid skill foundation!"
- **Badge**: "Skill Builder" badge
- **Display**: Badge notification + progress bar to next milestone (10 skills)

**10 Assessments Passed:**
- **Trigger**: 10th assessment passed
- **Message**: "📝 You're proving your knowledge consistently!"
- **Badge**: "Assessment Ace" badge
- **Display**: Badge notification with assessment success rate

**30-Day Learning Streak:**
- **Trigger**: 30 consecutive days with login
- **Message**: "🔥 You're on fire! 30 days of consistent learning!"
- **Badge**: "Month Master" badge
- **Display**: Streak calendar with milestone marker

**100% Course Completion Rate:**
- **Trigger**: All enrolled courses completed
- **Message**: "⭐ Perfect completion record! You finish what you start!"
- **Badge**: "Completionist" badge
- **Display**: Badge notification with completion percentage chart

#### Milestone Notifications

**In-App:**
- Toast notification when milestone achieved
- Badge gallery updates automatically
- Milestone history page

**Email (Optional):**
- Weekly summary of milestones achieved
- Major milestones (30-day streak, etc.)
- User can configure email preferences

#### Data Sources
- **Course Builder MS**: Course completion data
- **Skills Engine MS**: Skill acquisition counts
- **Assessment MS**: Assessment pass counts

---

### 6. Engagement Momentum

**Purpose**: Provide real-time feedback on engagement levels with motivational context

#### Momentum States

**On Fire 🔥:**
- **Condition**: High activity in last 7 days
- **Calculation**: 
  ```javascript
  const activeDays = countActiveDaysLast7Days();
  const completions = countCompletionsLast7Days();
  if (activeDays >= 6 && completions >= 2) return "On Fire";
  ```
- **Display**: 
  - Large flame icon
  - Message: "You're on fire! Keep this momentum going!"
  - Next milestone preview
- **Color**: Red/Orange gradient

**Warming Up 🌟:**
- **Condition**: Increasing activity trend
- **Calculation**: 
  ```javascript
  const thisWeek = countActivityThisWeek();
  const lastWeek = countActivityLastWeek();
  if (thisWeek > lastWeek && thisWeek >= 3) return "Warming Up";
  ```
- **Display**:
  - Star icon
  - Message: "Your momentum is building! Nice work!"
  - Encouragement to maintain pace
- **Color**: Yellow/Gold gradient

**Needs Boost 💡:**
- **Condition**: Declining activity (gentle nudge, not punishment)
- **Calculation**:
  ```javascript
  const thisWeek = countActivityThisWeek();
  const lastWeek = countActivityLastWeek();
  if (thisWeek < lastWeek && thisWeek < 2) return "Needs Boost";
  ```
- **Display**:
  - Light bulb icon
  - Message: "Let's get back on track! Small steps lead to big progress."
  - Suggested next action (e.g., "Resume your course?")
- **Color**: Blue/Teal (calm, supportive)

#### Data Sources
- **Engagement Analytics**: AS-001 #5 (Engagement & Activity Patterns)
- **Auth Service MS**: Login frequency
- **Course Builder MS**: Course activity
- **All microservices**: Combined activity metrics

---

## Display Features

### Visual Badge Gallery

**Layout:**
- Grid view of earned badges
- Locked badges shown in grayscale (with unlock criteria)
- Badge hover: Shows achievement date and description
- Sort options: By date earned, by category, by rarity

**Badge Cards:**
```javascript
{
  badgeId: "course-master-gold",
  name: "Course Master - Gold",
  icon: "🏆",
  earned: true,
  earnedDate: "2025-10-05",
  description: "Completed 25 courses",
  rarity: "Rare (earned by 8% of learners)"
}
```

**Features:**
- Badge count: "12 of 45 badges earned"
- Progress to next badge visible on locked badges
- Share badge on social media (optional, user-controlled)

---

### Progress Bars for Milestones

**Visual Design:**
- Animated progress bars with percentage
- Color gradient based on progress (red → yellow → green)
- Next milestone preview above bar

**Example:**
```
Skills Acquired: ████████░░ 32/50 skills
Next Milestone: "Master" tier (18 more skills)
```

**Implementation:**
- Real-time updates (no page refresh)
- Smooth animations on progress changes
- Confetti animation when milestone reached

---

### Streak Calendars

**Visual Design:**
- Calendar grid showing last 30 days
- Green highlight for active days
- Current streak highlighted in bold
- Longest streak marker

**Example:**
```
October 2025
Mo Tu We Th Fr Sa Su
 2  3  4  5  6  7  8   ← Week 1 (7/7 days active)
 9 10 11 12 13 14 15   ← Week 2 (5/7 days active)
16 17 18 19 20 21 22   ← Week 3 (6/7 days active)

Current Streak: 🔥 15 days
Longest Streak: 🏆 23 days
```

**Features:**
- Hover on day: Shows activity details
- Click day: Links to activity log for that day
- Export calendar as image

---

### Points Accumulation Chart

**Chart Type:** Line chart with area fill

**X-Axis:** Time (daily, weekly, or monthly view)

**Y-Axis:** Cumulative points

**Features:**
- Zoom controls (last 7 days, 30 days, 90 days, all time)
- Hover tooltips showing points breakdown for that period
- Milestone markers on timeline
- Export chart as PNG

**Example:**
```
Points Over Time (Last 30 Days)

4000│                            ●
    │                      ●●●●●●
    │            ●●●●●●●●●●
    │      ●●●●●●
    │●●●●●●
    └────────────────────────────────
     Oct 1        Oct 15       Oct 30

Total Points: 3,847 (+450 this month)
```

---

### Comparative Leaderboard Position

**Display Type:** Percentile with visual indicator

**Example:**
```
Your Rank: Top 15% 🌟

Distribution:
Top 10%  ▓▓▓▓▓ ← Elite
Top 25%  ▓▓▓▓▓▓▓▓▓▓ ← You are here
Top 50%  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Top 75%  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

**Privacy:**
- No individual names shown
- Only user's own position visible
- Percentile-based (not absolute rank)

---

### Next Milestone Preview

**Display:** Prominent callout showing next achievable goal

**Example:**
```
┌─────────────────────────────────┐
│  Next Milestone: 5 Skills       │
│  Progress: ████░░ 3/5           │
│  "2 more skills to unlock       │
│   Skill Builder badge!"         │
└─────────────────────────────────┘
```

**Features:**
- Shows closest milestone across all categories
- Actionable advice: "Complete React course to unlock next skill"
- Progress bar with percentage
- Estimated time to achieve (based on velocity)

---

### Shareable Achievement Cards

**Purpose:** Allow users to share achievements on social media (optional, privacy-controlled)

**Card Design:**
- Branded header with company logo
- Achievement icon and title
- User's chosen display name (or anonymous)
- Achievement date
- Background graphics

**Example:**
```
┌────────────────────────────────┐
│  🎓 Learning Analytics Platform│
│                                │
│       🏆 Course Master         │
│        (Gold Tier)             │
│                                │
│  25 Courses Completed          │
│  Earned: October 11, 2025      │
│                                │
│  John D. (or "Anonymous")      │
└────────────────────────────────┘
```

**Privacy Controls:**
- User must explicitly enable sharing
- Choose display name vs anonymous
- Select which achievements to share
- Disable sharing anytime

---

## AI-Powered Motivation (Google Gemini)

### Purpose

Use Google Gemini AI to generate personalized, contextual encouragement messages that adapt to user's progress, challenges, and achievements.

### Use Cases

#### 1. Personalized Encouragement Messages

**Trigger:** User logs in after period of inactivity (> 3 days)

**Input to AI:**
```json
{
  "context": "user_return_after_inactivity",
  "daysInactive": 5,
  "lastActivity": "completed React course",
  "currentStreak": 0,
  "previousStreak": 14,
  "totalPoints": 1250
}
```

**AI Prompt:**
```
Generate a warm, encouraging message (2-3 sentences) for a learner who has been inactive for 5 days. Their last activity was completing a React course and they previously had a 14-day streak. Focus on positive reinforcement and easy next steps. Avoid guilt or pressure.
```

**Example AI Response:**
```
"Welcome back! We noticed you completed the React course before your break—great work! Ready to rebuild your learning momentum? Even 10 minutes today counts. 💪"
```

---

#### 2. Celebration of Achievements

**Trigger:** User achieves milestone (e.g., 30-day streak, 10 courses completed)

**Input to AI:**
```json
{
  "context": "milestone_achieved",
  "milestone": "30_day_streak",
  "userName": "Sarah",
  "totalCourses": 8,
  "totalSkills": 15,
  "averageScore": 87
}
```

**AI Prompt:**
```
Generate an enthusiastic celebration message (2-3 sentences) for Sarah who just achieved a 30-day learning streak. She has completed 8 courses and acquired 15 skills with an 87% average. Make it personal and motivating.
```

**Example AI Response:**
```
"🔥 Sarah, 30 days in a row is incredible! Your dedication shows in your results—8 courses, 15 skills, and an impressive 87% average. You're building real expertise. What's next on your learning journey?"
```

---

#### 3. Gentle Nudges for Losing Momentum

**Trigger:** Declining engagement detected (Needs Boost state)

**Input to AI:**
```json
{
  "context": "declining_engagement",
  "previousWeekActivity": 5,
  "currentWeekActivity": 1,
  "incompleteCourses": ["Node.js Fundamentals"],
  "percentComplete": 60,
  "lastLogin": "5 days ago"
}
```

**AI Prompt:**
```
Generate a supportive, non-judgmental message (2-3 sentences) for a learner whose activity has decreased. They're 60% through a Node.js course. Focus on progress already made and simple next steps. Avoid pressure or guilt.
```

**Example AI Response:**
```
"You're already 60% through Node.js Fundamentals—that's solid progress! Life gets busy, but your learning is still here waiting. How about just one lesson this week to keep momentum? 🎯"
```

---

#### 4. Suggestions for Next Achievable Milestones

**Trigger:** User viewing milestone progress page

**Input to AI:**
```json
{
  "context": "milestone_suggestions",
  "closestMilestones": [
    { "type": "skills", "current": 8, "target": 10, "remaining": 2 },
    { "type": "streak", "current": 5, "target": 7, "remaining": 2 },
    { "type": "courses", "current": 12, "target": 15, "remaining": 3 }
  ],
  "userPreferences": ["quick_wins", "skills"]
}
```

**AI Prompt:**
```
Analyze these 3 upcoming milestones and suggest which one the user should focus on first, with specific actionable advice. Consider they prefer quick wins and skills. Make it motivating (2-3 sentences).
```

**Example AI Response:**
```
"You're just 2 skills away from the '10 Skills Mastered' badge! That's your quickest win. Complete one assessment to unlock a skill, and you could achieve this milestone this week. Then aim for that 7-day streak! 🎯"
```

---

### AI Integration Details

**API:** Google Gemini (Free Tier)

**Rate Limiting:** 50 requests/minute (complies with free tier)

**Caching:** 48-hour TTL for similar contexts (reduces API calls by 70%)

**Fallback:** Rule-based generic messages if AI unavailable or quota exhausted

**Quality Assurance:**
- Response validation (length, tone, content appropriateness)
- Content filtering for inappropriate suggestions
- Fallback to templates if AI response quality low
- Human review sample (1% of responses monthly)

**Performance:**
- Cache hit: < 10ms
- Cache miss (AI call): < 2s
- Async generation (non-blocking UI)

---

## Privacy & Ethics

### Privacy Principles

**1. Anonymized Leaderboards:**
- No user names or identifiers in leaderboards
- Only percentile rankings, never absolute positions
- K-anonymity: minimum 10 users for any comparison
- Aggregated data only

**2. User Control:**
- Opt-out of leaderboards entirely (keeps personal badges)
- Control sharing preferences for achievements
- Choose display name vs anonymous
- Hide/show specific badges
- Disable AI motivational messages

**3. No Forced Competition:**
- Leaderboards are optional feature (not main dashboard)
- Alternative "personal goals" mode without comparisons
- Success measured by personal progress, not rank
- No penalties for opting out

**4. Positive Reinforcement:**
- No "failure" messages or negative comparisons
- Declining activity called "Needs Boost" (not "Falling Behind")
- Focus on progress made, not gaps
- Celebrate all achievements, big and small
- AI trained to avoid pressure, guilt, or shame

**5. Accessibility:**
- All users can earn achievements regardless of starting point
- Milestones at various difficulty levels
- Recognition for consistency, not just speed
- Alternative goals for different learning styles
- No time pressure or artificial urgency

### Ethical Guidelines

**Avoid:**
- ❌ Shaming users for low activity
- ❌ Creating anxiety about rank/position
- ❌ Forcing participation in leaderboards
- ❌ Exposing individual performance publicly
- ❌ Making competition mandatory

**Encourage:**
- ✅ Personal growth and progress
- ✅ Consistent learning habits
- ✅ Celebrating small wins
- ✅ Learning at own pace
- ✅ Intrinsic motivation

---

## Data Sources Summary

| Metric Category | Primary Data Sources | Derived Metrics |
|----------------|---------------------|-----------------|
| Achievement Tracking | Course Builder, Skills Engine, Assessment, Learner AI | Badge counts, tier levels |
| Progress & Streaks | Auth Service, Course Builder, Learner AI | Streak days, momentum scores |
| Points System | All microservices | Total points, points breakdown |
| Leaderboards | Aggregated analytics (all sources) | Percentile rankings |
| Progress Milestones | Course Builder, Skills Engine, Assessment | Milestone achievement flags |
| Engagement Momentum | AS-001 #5, Auth Service, Course Builder | Momentum state (On Fire, Warming Up, Needs Boost) |

**Key Point:** No new data collection required. All metrics calculated from existing data sources.

---

## Implementation Considerations

### Database Schema

**Table: `gamification_user_metrics`**
```sql
CREATE TABLE gamification_user_metrics (
  user_id UUID NOT NULL,
  total_points INT DEFAULT 0,
  streak_days INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  badges_earned JSONB DEFAULT '[]',
  milestones_achieved JSONB DEFAULT '[]',
  last_activity_date DATE,
  momentum_state VARCHAR(20),
  opt_out_leaderboards BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id)
);
```

### Calculation Frequency

- **Real-time**: Streak tracking (on login)
- **Hourly**: Points recalculation
- **Daily**: Badge tier checks, milestone checks
- **Weekly**: Leaderboard updates

### Performance

- Badge query: < 50ms
- Points calculation: < 100ms
- Leaderboard query: < 200ms (cached)
- AI motivation message: < 2s (or < 10ms cached)

---

## Related Documentation

- **FR-010**: Gamification Analytics Integration (High-level requirements)
- **AS-001 #5**: Engagement & Activity Patterns analytics
- **Google Gemini AI Integration**: `04-Analytics-Specifications/Google-Gemini-AI-Integration.md`
- **Analytics Catalog**: `04-Analytics-Specifications/Comprehensive-Analytics-Catalog.md`

---

**Document Version**: 1.0  
**Last Updated**: October 11, 2025  
**Status**: Complete - Ready for Implementation

