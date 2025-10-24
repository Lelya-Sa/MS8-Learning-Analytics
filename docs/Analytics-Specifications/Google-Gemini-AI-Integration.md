# Google Gemini AI Integration - Complete Specification

**Document Information**
- **Project**: Learning Analytics Microservice (#8)
- **Version**: 1.0
- **Date**: October 10, 2025
- **Status**: Production-Ready
- **AI Provider**: Google Gemini API
- **Integration Pattern**: REST API with response caching

---

## 🎯 Executive Summary

This document specifies the complete integration of **Google Gemini AI** into the Learning Analytics Microservice for generating intelligent insights, predictions, and personalized recommendations.

### Key Use Cases

| Use Case | Analytics # | Priority | Caching |
|----------|-------------|----------|---------|
| **Drop-Off Risk Explanations** | #15 | ⭐⭐⭐ HIGH | 24 hours |
| **Learning Outcome Forecasting** | #16 | ⭐⭐⭐ HIGH | 24 hours |
| **Personalized Recommendations** | #17 | ⭐⭐⭐ HIGH | 24 hours |
| **Platform Skill Demand Forecasting** | #18 | ⭐⭐ MEDIUM | 7 days |
| **RAG Chatbot Responses** | FR-006 | ⭐⭐⭐ HIGH | 4 hours |

---

## 🔌 API Integration Architecture

### **Connection Setup**

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Use Gemini Pro model for analytics
const model = genAI.getGenerativeModel({ 
  model: 'gemini-pro',
  generationConfig: {
    temperature: 0.7,      // Balanced creativity
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    }
  ]
});
```

### **Environment Configuration**

```bash
# .env file
GOOGLE_GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-pro
GEMINI_MAX_TOKENS=2048
GEMINI_TEMPERATURE=0.7
GEMINI_CACHE_TTL_HOURS=24
```

---

## 📊 Use Case #1: Drop-Off Risk Explanations (Analytics #15)

### **Purpose**
Generate human-readable explanations for drop-off risk predictions, translating ML model outputs into actionable insights.

### **Input Data**

```javascript
interface DropOffRiskInput {
  userId: string;
  riskScore: number;           // 0-100 from ML model
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: Array<{
    factor: string;
    contribution: number;      // Percentage contribution
    currentValue: any;
    threshold: any;
  }>;
  userContext: {
    courseName: string;
    currentProgress: number;
    engagementScore: number;
    recentActivity: string;
  };
}
```

### **Gemini Prompt Template**

```javascript
async function generateDropOffRiskExplanation(
  input: DropOffRiskInput
): Promise<string> {
  const prompt = `
You are an educational analytics AI assistant. Analyze the following learner's drop-off risk and provide a concise, empathetic explanation with actionable recommendations.

**Learner Context:**
- Course: ${input.userContext.courseName}
- Progress: ${input.userContext.currentProgress}%
- Engagement Score: ${input.userContext.engagementScore}/100
- Recent Activity: ${input.userContext.recentActivity}

**Risk Assessment:**
- Risk Level: ${input.riskLevel}
- Risk Score: ${input.riskScore}/100

**Contributing Factors:**
${input.riskFactors.map((f, i) => `${i + 1}. ${f.factor} (${f.contribution}% contribution)
   Current: ${f.currentValue}
   Expected: ${f.threshold}`).join('\n')}

**Task:**
1. Explain the risk level in 2-3 sentences (empathetic, non-judgmental)
2. List top 3 actionable recommendations (specific, achievable)
3. Provide encouragement and next steps

**Format your response as JSON:**
{
  "explanation": "string",
  "recommendations": ["string", "string", "string"],
  "encouragement": "string",
  "nextSteps": "string"
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Parse JSON response
  return JSON.parse(text);
}
```

### **Example Output**

```json
{
  "explanation": "Your engagement has decreased over the past two weeks, and you've missed several key learning sessions. This pattern suggests you might be facing challenges that could affect your course completion.",
  "recommendations": [
    "Schedule 30-minute learning blocks 3x per week at your peak time (8-10 AM)",
    "Reach out to your course trainer for a quick check-in session",
    "Review the 'JavaScript Async' module which seems to be a sticking point"
  ],
  "encouragement": "Remember, you've successfully completed 65% of the course already! You have the capability - let's get you back on track.",
  "nextSteps": "Start with the shortest module tomorrow morning, then schedule a 15-minute trainer chat this week."
}
```

### **Caching Strategy**

```javascript
// Cache key: user_id + analytics_type + data_hash
const cacheKey = `gemini:dropoff:${userId}:${hash(input)}`;
const cachedResult = await cache.get(cacheKey);

if (cachedResult && cachedResult.age < 24 * 60 * 60 * 1000) {
  return cachedResult.data;
}

// Generate fresh response
const freshResult = await generateDropOffRiskExplanation(input);

// Cache for 24 hours
await cache.set(cacheKey, freshResult, 24 * 60 * 60 * 1000);

return freshResult;
```

---

## 🔮 Use Case #2: Learning Outcome Forecasting (Analytics #16)

### **Purpose**
Predict learning outcomes (final grade, completion time) with AI-powered natural language explanations.

### **Input Data**

```javascript
interface OutcomeForecastInput {
  userId: string;
  courseId: string;
  currentData: {
    progress: number;
    averageScore: number;
    timeSpent: number;         // hours
    engagementScore: number;
    completedModules: number;
    totalModules: number;
  };
  historicalData: {
    similarLearnersAverageGrade: number;
    similarLearnersCompletionTime: number; // weeks
    coursePassRate: number;
  };
}
```

### **Gemini Prompt Template**

```javascript
async function generateOutcomeForecast(
  input: OutcomeForecastInput
): Promise<any> {
  const prompt = `
You are an educational analytics AI. Predict this learner's likely outcomes based on their current performance and historical data.

**Current Performance:**
- Progress: ${input.currentData.progress}%
- Average Score: ${input.currentData.averageScore}%
- Time Spent: ${input.currentData.timeSpent} hours
- Engagement: ${input.currentData.engagementScore}/100
- Completed: ${input.currentData.completedModules}/${input.currentData.totalModules} modules

**Historical Context:**
- Similar learners average grade: ${input.historicalData.similarLearnersAverageGrade}%
- Similar learners completion time: ${input.historicalData.similarLearnersCompletionTime} weeks
- Course pass rate: ${input.historicalData.coursePassRate}%

**Task:**
1. Predict final course grade (0-100 with confidence level)
2. Predict completion time in weeks
3. Predict completion likelihood (%)
4. Provide reasoning for predictions
5. Suggest accelerators or interventions if needed

**Format as JSON:**
{
  "predictedGrade": number,
  "gradeConfidence": "low" | "medium" | "high",
  "predictedCompletionWeeks": number,
  "completionLikelihood": number,
  "reasoning": "string",
  "accelerators": ["string"],
  "interventions": ["string"]
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}
```

### **Caching:** 24 hours per user per course

---

## 💡 Use Case #3: Personalized Recommendations (Analytics #17) - PRIMARY USE CASE

### **Purpose**
Generate intelligent, personalized learning recommendations based on user profile, skills, goals, and learning patterns.

### **Input Data**

```javascript
interface RecommendationInput {
  userId: string;
  userProfile: {
    currentSkills: Array<{ skillName: string; level: number; competency: string }>;
    skillGaps: Array<{ skillName: string; gap: number; priority: number }>;
    learningStyle: string;
    peakLearningTime: string;
    completedCourses: string[];
    failedTopics: string[];
  };
  goals: {
    desiredSkills: string[];
    targetCompetencyLevel: string;
    deadline?: string;
    careerObjective?: string;
  };
  context: {
    availableTimePerWeek: number;
    organizationPriorities?: string[];
    teamSkillGaps?: string[];
  };
}
```

### **Gemini Prompt Template**

```typescript
async function generatePersonalizedRecommendations(
  input: RecommendationInput
): Promise<any> {
  const prompt = `
You are an AI learning advisor. Create a personalized learning plan for this user based on their profile, goals, and context.

**User Profile:**
Current Skills: ${JSON.stringify(input.userProfile.currentSkills, null, 2)}
Skill Gaps: ${JSON.stringify(input.userProfile.skillGaps, null, 2)}
Learning Style: ${input.userProfile.learningStyle}
Best Learning Time: ${input.userProfile.peakLearningTime}
Recently Failed Topics: ${input.userProfile.failedTopics.join(', ')}

**Goals:**
Desired Skills: ${input.goals.desiredSkills.join(', ')}
Target Level: ${input.goals.targetCompetencyLevel}
${input.goals.deadline ? `Deadline: ${input.goals.deadline}` : ''}
${input.goals.careerObjective ? `Career Objective: ${input.goals.careerObjective}` : ''}

**Context:**
Available Time: ${input.context.availableTimePerWeek} hours/week
${input.context.organizationPriorities ? `Org Priorities: ${input.context.organizationPriorities.join(', ')}` : ''}

**Task:**
1. Recommend top 5 courses/learning paths (prioritized)
2. Create optimal weekly study schedule
3. Suggest learning strategies for their learning style
4. Provide skill acquisition sequence (prerequisites first)
5. Offer motivational insights

**Format as JSON:**
{
  "recommendedCourses": [
    {
      "courseId": "string",
      "courseName": "string",
      "priority": number,
      "reasoning": "string",
      "expectedOutcome": "string",
      "estimatedTime": "string"
    }
  ],
  "weeklySchedule": {
    "monday": ["activity"],
    "tuesday": ["activity"],
    ...
  },
  "learningStrategies": ["string"],
  "skillSequence": ["skill1", "skill2", ...],
  "motivation": "string"
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}
```

### **Response Example**

```json
{
  "recommendedCourses": [
    {
      "courseId": "course_456",
      "courseName": "Modern JavaScript Fundamentals",
      "priority": 1,
      "reasoning": "Addresses your JavaScript ES6+ skill gap (priority score: 92). Your visual learning style aligns well with this video-heavy course.",
      "expectedOutcome": "+15 levels in JavaScript, unlocks React pathway",
      "estimatedTime": "2 weeks at 5 hours/week"
    },
    {
      "courseId": "course_789",
      "courseName": "Async Programming Patterns",
      "priority": 2,
      "reasoning": "You struggled with async topics before. This course offers hands-on practice which suits your learning style.",
      "expectedOutcome": "Master async/await, improve assessment scores by ~20%",
      "estimatedTime": "1 week at 5 hours/week"
    }
  ],
  "weeklySchedule": {
    "monday": ["8-9 AM: JavaScript module 1 (your peak time)", "Lunch break: Review notes"],
    "wednesday": ["8-10 AM: JavaScript module 2 + practice", "Evening: Optional review"],
    "friday": ["8-9 AM: Complete assessment", "Reflect on week's progress"]
  },
  "learningStrategies": [
    "Use visual diagrams for complex concepts (matches your visual learning style)",
    "Practice coding immediately after watching videos (active learning)",
    "Review failed topics with fresh perspective before moving forward"
  ],
  "skillSequence": ["JavaScript ES6", "Async Programming", "React Basics", "Advanced React"],
  "motivation": "You've shown excellent consistency with your 12-day learning streak! Your visual learning approach is perfect for modern web development. Focus on JavaScript mastery now, and you'll unlock the entire React pathway within a month."
}
```

### **Caching:** 24 hours per user (recommendations change as skills improve)

---

## 📈 Use Case #4: Platform Skill Demand Forecasting (Analytics #18)

### **Purpose**
Forecast future skill demand trends on the platform using historical enrollment and skill acquisition patterns.

### **Input Data**

```typescript
interface SkillDemandForecastInput {
  skillId: string;
  skillName: string;
  historicalData: {
    last12MonthsEnrollments: number[];    // Monthly enrollments
    last12MonthsAcquisitions: number[];   // Monthly skill acquisitions
    last12MonthsValuePropTargets: number[]; // Org target skill mentions
  };
  currentData: {
    currentEnrollments: number;
    currentDemandScore: number;  // 0-100
    trendDirection: 'increasing' | 'stable' | 'decreasing';
  };
}
```

### **Gemini Prompt Template**

```typescript
async function forecastSkillDemand(
  input: SkillDemandForecastInput
): Promise<any> {
  const prompt = `
You are a platform analytics AI. Forecast skill demand trends for the next 6-12 months based on historical patterns.

**Skill:** ${input.skillName}

**Historical Data (Last 12 Months):**
Monthly Enrollments: ${input.historicalData.last12MonthsEnrollments.join(', ')}
Monthly Acquisitions: ${input.historicalData.last12MonthsAcquisitions.join(', ')}
Org Targets (mentions): ${input.historicalData.last12MonthsValuePropTargets.join(', ')}

**Current Status:**
- Current Enrollments: ${input.currentData.currentEnrollments}
- Demand Score: ${input.currentData.currentDemandScore}/100
- Trend: ${input.currentData.trendDirection}

**Task:**
1. Forecast demand score for next 6 months (monthly predictions)
2. Identify trend patterns (seasonal, growth, decline)
3. Predict peak demand months
4. Explain reasoning for forecast
5. Provide confidence level

**Format as JSON:**
{
  "forecastedDemand": [
    { "month": "2025-11", "demandScore": number, "enrollmentEstimate": number },
    ...
  ],
  "trendPattern": "string",
  "peakMonths": ["month1", "month2"],
  "reasoning": "string",
  "confidence": "low" | "medium" | "high"
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}
```

### **Caching:** 7 days (skill demand changes slowly)

---

## 💬 Use Case #5: RAG Chatbot Integration (FR-006)

### **Purpose**
Provide conversational analytics insights through the RAG Assistant Microservice.

### **Integration Pattern**

```typescript
// gRPC Service Definition
service AnalyticsChatService {
  rpc AskQuestion(QuestionRequest) returns (stream AnswerChunk);
}

// Implementation with Gemini
async function* handleAnalyticsQuestion(
  userId: string,
  question: string,
  context: AnalyticsContext
): AsyncGenerator<string> {
  
  // Build context from user's analytics
  const analyticsContext = await buildAnalyticsContext(userId);
  
  const prompt = `
You are a learning analytics chatbot. Answer the user's question about their learning analytics.

**User Question:** ${question}

**User's Analytics Context:**
- Skills Acquired: ${analyticsContext.skillsAcquired}
- Courses Completed: ${analyticsContext.coursesCompleted}
- Current Progress: ${analyticsContext.currentProgress}%
- Learning Velocity: ${analyticsContext.learningVelocity} topics/week
- Engagement Score: ${analyticsContext.engagementScore}/100
- At-Risk Status: ${analyticsContext.riskLevel}

**Task:**
Provide a helpful, conversational answer based on their analytics. Be specific, use their data, and provide actionable insights.

**Respond in a friendly, conversational tone.**
`;

  // Stream response for real-time UX
  const result = await model.generateContentStream(prompt);
  
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    yield chunkText;
  }
}
```

### **Example Interaction**

```
User: "Why is my learning velocity decreasing?"

AI (streaming):
"I can see that your learning velocity has dropped from 2.5 topics/week 
last month to 1.8 topics/week this month. Looking at your data, here 
are the main factors:

1. Your session duration decreased by 40% - you went from 45-minute 
   sessions to 25-minute sessions. Shorter sessions often mean less 
   deep learning.

2. You haven't accessed the platform on weekends for the past 3 weeks, 
   which used to be productive learning time for you.

3. Your engagement with practice exercises dropped - only 3 attempts 
   this month vs. 12 last month.

💡 Suggestion: Try scheduling two 45-minute sessions this week during 
your peak time (8-10 AM). Focus on one topic at a time, and aim for 
at least 5 practice attempts. Small consistent actions will help you 
regain momentum! 🚀"
```

### **Caching:** 4 hours for similar questions

---

## 🔐 Security & Rate Limiting

### **API Key Management**

```typescript
// Secure key storage (environment variables)
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

// Key validation on startup
if (!GEMINI_API_KEY) {
  throw new Error('GOOGLE_GEMINI_API_KEY not configured');
}

// Rotate keys quarterly (security best practice)
```

### **Rate Limiting**

```typescript
// Gemini API limits (as of October 2024)
const RATE_LIMITS = {
  requestsPerMinute: 60,
  requestsPerDay: 1500,
  tokensPerMinute: 32000,
  tokensPerDay: 50000
};

// Application-level rate limiting
class GeminiRateLimiter {
  private requestCount = 0;
  private tokenCount = 0;
  private windowStart = Date.now();
  
  async checkLimit(): Promise<boolean> {
    const now = Date.now();
    const minuteElapsed = (now - this.windowStart) / 1000 / 60;
    
    if (minuteElapsed >= 1) {
      // Reset window
      this.requestCount = 0;
      this.tokenCount = 0;
      this.windowStart = now;
      return true;
    }
    
    // Check if under limit
    return this.requestCount < RATE_LIMITS.requestsPerMinute;
  }
  
  recordRequest(tokens: number): void {
    this.requestCount++;
    this.tokenCount += tokens;
  }
}
```

### **Cost Management**

```typescript
// Monitor costs
interface GeminiUsageMetrics {
  date: string;
  totalRequests: number;
  totalTokens: number;
  estimatedCost: number;  // $0.00025 per 1K tokens (Gemini Pro)
  cacheHitRate: number;   // % requests served from cache
  costSavings: number;    // $ saved due to caching
}

// Track usage daily
async function trackGeminiUsage(): Promise<void> {
  const usage = await calculateDailyUsage();
  
  await db.query(`
    INSERT INTO gemini_usage_metrics (
      date, total_requests, total_tokens, estimated_cost, cache_hit_rate
    ) VALUES ($1, $2, $3, $4, $5)
  `, [
    usage.date,
    usage.totalRequests,
    usage.totalTokens,
    usage.estimatedCost,
    usage.cacheHitRate
  ]);
  
  // Alert if costs exceed budget
  if (usage.estimatedCost > DAILY_BUDGET_THRESHOLD) {
    await sendCostAlert(usage);
  }
}
```

**Expected Costs (10,000 users):**
- Daily requests: ~500 (due to 24h caching)
- Daily tokens: ~1M tokens
- Daily cost: ~$0.25
- Monthly cost: ~$7.50

---

## 🧪 Error Handling & Fallbacks

### **Gemini API Failure Handling**

```typescript
async function callGeminiWithFallback<T>(
  geminiFunction: () => Promise<T>,
  fallbackFunction: () => T
): Promise<T> {
  try {
    // Attempt Gemini API call
    const result = await geminiFunction();
    return result;
    
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Check error type
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      // Wait and retry once
      await sleep(5000);
      try {
        return await geminiFunction();
      } catch (retryError) {
        // Use fallback
        console.warn('Gemini retry failed, using fallback');
        return fallbackFunction();
      }
    }
    
    if (error.code === 'INVALID_API_KEY') {
      throw error; // Critical error, don't fallback
    }
    
    // For other errors, use fallback
    console.warn('Using fallback due to Gemini error');
    return fallbackFunction();
  }
}
```

### **Rule-Based Fallbacks**

```typescript
// Fallback for recommendations (rule-based)
function fallbackRecommendations(input: RecommendationInput): any {
  const topGaps = input.userProfile.skillGaps
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);
  
  return {
    recommendedCourses: topGaps.map(gap => ({
      courseName: `Course for ${gap.skillName}`,
      priority: gap.priority,
      reasoning: `Addresses skill gap in ${gap.skillName}`,
      estimatedTime: `${Math.ceil(gap.gap / 5)} weeks`
    })),
    learningStrategies: [
      "Focus on high-priority skill gaps first",
      "Practice consistently during your peak learning time",
      "Complete prerequisite skills before advanced topics"
    ],
    motivation: "Continue your learning journey step by step!"
  };
}
```

---

## 📊 Monitoring & Observability

### **Gemini API Health Dashboard**

```typescript
// GET /api/v1/system/gemini-health
async function getGeminiHealth(): Promise<any> {
  const metrics = await db.query(`
    SELECT
      DATE(timestamp) as date,
      COUNT(*) as total_requests,
      AVG(response_time_ms) as avg_response_time,
      COUNT(*) FILTER (WHERE success = true) as successful,
      COUNT(*) FILTER (WHERE success = false) as failed,
      SUM(tokens_used) as total_tokens,
      SUM(estimated_cost) as total_cost
    FROM gemini_api_logs
    WHERE timestamp >= NOW() - INTERVAL '7 days'
    GROUP BY DATE(timestamp)
    ORDER BY date DESC
  `);
  
  return {
    weeklyMetrics: metrics.rows,
    cacheHitRate: await getCacheHitRate(),
    currentRateLimit: await getCurrentRateLimit(),
    monthlyBudget: {
      used: await getMonthlySpend(),
      limit: MONTHLY_BUDGET,
      remaining: MONTHLY_BUDGET - await getMonthlySpend()
    }
  };
}
```

### **Logging**

```sql
-- Gemini API usage logs
CREATE TABLE gemini_api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  use_case VARCHAR(50) NOT NULL,  -- 'dropoff', 'forecast', 'recommendations', 'chatbot'
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_tokens INTEGER,
  response_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  estimated_cost NUMERIC(8,6),
  cache_hit BOOLEAN DEFAULT false,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT check_use_case CHECK (
    use_case IN ('dropoff_explanation', 'outcome_forecast', 'recommendations', 'skill_demand_forecast', 'chatbot')
  )
);

CREATE INDEX idx_gemini_logs_timestamp ON gemini_api_logs(timestamp DESC);
CREATE INDEX idx_gemini_logs_use_case ON gemini_api_logs(use_case);
CREATE INDEX idx_gemini_logs_user ON gemini_api_logs(user_id);
```

---

## 🎯 Best Practices

### **1. Prompt Engineering**

✅ **Structured Prompts**: Clear instructions, context, expected format  
✅ **Few-Shot Examples**: Include example outputs in prompts when needed  
✅ **JSON Format**: Request structured JSON for easy parsing  
✅ **Validation**: Validate Gemini responses before using

### **2. Cost Optimization**

✅ **Aggressive Caching**: 24-hour cache for user-specific insights  
✅ **Batch Processing**: Group requests when possible  
✅ **Token Limits**: Keep prompts concise, limit max output tokens  
✅ **Fallbacks**: Use rule-based logic when Gemini unavailable

### **3. Response Quality**

✅ **Validation**: Parse and validate JSON responses  
✅ **Sanitization**: Filter inappropriate content (safety settings)  
✅ **Fact-Checking**: Validate recommendations against actual available courses  
✅ **Consistency**: Similar inputs should produce similar outputs

### **4. User Experience**

✅ **Streaming**: Use `generateContentStream()` for long responses  
✅ **Loading States**: Show "AI is analyzing..." indicators  
✅ **Transparency**: Indicate AI-generated content clearly  
✅ **Feedback Loop**: Allow users to rate AI recommendations

---

## 📋 Implementation Checklist

### **Setup & Configuration**
- [ ] Obtain Google Gemini API key
- [ ] Configure environment variables
- [ ] Set up rate limiting
- [ ] Create usage monitoring tables
- [ ] Implement caching layer

### **Integration Development**
- [ ] Implement #15: Drop-off risk explanations
- [ ] Implement #16: Learning outcome forecasting
- [ ] Implement #17: Personalized recommendations (primary)
- [ ] Implement #18: Skill demand forecasting
- [ ] Implement FR-006: RAG chatbot integration

### **Testing**
- [ ] Unit tests for prompt generation
- [ ] Integration tests with Gemini API
- [ ] Fallback scenario tests
- [ ] Rate limiting tests
- [ ] Cost estimation validation

### **Monitoring**
- [ ] Set up usage tracking
- [ ] Configure cost alerts
- [ ] Monitor response times
- [ ] Track cache hit rates
- [ ] Set up error alerting

---

## 💰 Cost Analysis

### **Pricing (Google Gemini Pro)**
- **Input:** $0.00025 per 1K tokens
- **Output:** $0.00050 per 1K tokens
- **Average per request:** ~1.5K tokens = $0.00075

### **Expected Usage (10,000 users)**

| Use Case | Daily Requests | Tokens/Request | Daily Cost | Monthly Cost |
|----------|----------------|----------------|------------|--------------|
| Drop-off Explanations (#15) | 100 | 1,500 | $0.08 | $2.40 |
| Outcome Forecasting (#16) | 150 | 1,200 | $0.09 | $2.70 |
| Recommendations (#17) | 200 | 2,000 | $0.20 | $6.00 |
| Skill Demand Forecast (#18) | 30 | 1,000 | $0.02 | $0.60 |
| Chatbot Responses (FR-006) | 300 | 800 | $0.12 | $3.60 |
| **TOTAL** | **780** | **~1,300 avg** | **$0.51** | **$15.30** |

**With 90% Cache Hit Rate:** ~$1.53/month ✅ **Very affordable!**

### **Cost Controls**

1. **Aggressive Caching**: Reduces API calls by 90%
2. **Token Limits**: Cap max output tokens at 2,048
3. **Daily Budget Alerts**: Alert if spending > $2/day
4. **Fallback Logic**: Rule-based alternatives when needed

---

## 🚀 Deployment Guidelines

### **Environment Setup**

```bash
# Install Google Generative AI package
npm install @google/generative-ai

# Set environment variable
export GOOGLE_GEMINI_API_KEY="your_api_key_here"
```

### **Production Checklist**

- [ ] API key secured (never commit to repository)
- [ ] Rate limiting configured and tested
- [ ] Caching layer deployed
- [ ] Monitoring dashboard live
- [ ] Cost alerts configured
- [ ] Fallback logic tested
- [ ] Error handling validated
- [ ] Usage logging enabled

---

## 📚 Reference Documentation

**Google Gemini API Docs:**
- Official: https://ai.google.dev/docs
- Node.js SDK: https://www.npmjs.com/package/@google/generative-ai
- Pricing: https://ai.google.dev/pricing

**Related Project Documents:**
- Analytics Specifications: `04-Analytics-Specifications/Comprehensive-Analytics-Catalog.md`
- Requirements: `00-Requirements/Learning-Analytics-Final-Requirements-v18.md` (ML-002)
- API Documentation: `02-API-Documentation/` (gRPC-Services.md)

---

**Document Status:** ✅ Production-Ready  
**Integration Complexity:** Medium  
**Estimated Implementation Time:** 2-3 days  
**Expected Monthly Cost:** $1.53 (with 90% cache hit rate)  
**Business Value:** High (AI-powered insights differentiate the platform)

**🚀 Ready for Google Gemini AI integration!**

