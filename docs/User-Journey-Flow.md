# Learning Analytics Microservice — User Journey Flow

**Service**: Learning Analytics Microservice (#8)

**Version**: 1.0

**Date**: October 24, 2025

**Status**: Authoritative UX flow reference

---

## 🎯 Purpose

Define clear, end‑to‑end user journeys across roles for the Learning Analytics microservice, aligning UX steps with backend data flows, APIs, caching, and testing. This serves product, design, engineering, and QA for a shared, testable understanding of the experience.

---

## 👥 Roles Covered

- Learner
- Trainer
- Organization Manager (HR)
- Platform Admin
- Multi‑Role (seamless role switching)

---

## 🧭 Principles

- Fast time‑to‑first‑insight with progressive rendering (SWR strategy)
- Clear loading states and actionable empty states
- Privacy‑first UX (explicit consent, data scopes, GDPR flows)
- Deterministic navigation, consistent across roles
- Resilient to partial data and background refreshes

---

## 🗺️ Global Flow Overview

```
USER → Auth (JWT) → Dashboard Shell (SWR) → Data Availability Check
   └─ if first-time or stale data → Batch Pipeline trigger/await
      └─ Stage 1: Collect from 9 microservices
      └─ Stage 2: Analysis Engine (parallel compute)
      └─ Stage 3: Aggregate & refresh materialized views
UI progressively hydrates sections as views become available
```

Key UX states: "Analyzing your learning data…", skeleton charts, section‑level spinners, last‑updated timestamps, and retry/notify options for long batches.

---

## 📚 Related Authoritative Docs

- Architecture overview: `01-Architecture/Architecture-Overview.md`
- Decisions: `01-Architecture/Implementation-Decisions-Log.md`
- Processing pipeline: `03-Data-Schemas/02-PROCESSING/Processing-Pipeline-Complete.md`
- Data lineage visualization: `03-Data-Schemas/02-PROCESSING/Data-Lineage-Flow.md`
- Topic learning path flow: `03-Data-Schemas/03-DATA-MODELS/Complete-Topic-Based-Learning-Path-Flow.md`
- Multi‑role support: `03-Data-Schemas/03-DATA-MODELS/Multi-Role-Support-Architecture.md`
- E2E journeys (tests): `05-Testing-TDD/03-System-Tests-Design/E2E-Tests-Complete.md`

---

## 🧪 Data Readiness & SWR Contract

- Dashboard requests read from materialized views; if missing/stale, UI shows loading and initiates/awaits refresh.
- Section hydration is independent: each analytic panel renders when its view is ready.
- SLA targets: time‑to‑first‑content ≤ 2s; first‑time full hydration ≤ ~45s; returning users ≤ 2s for cached views.

---

## 🎓 Learner Journeys

### L1 — First‑Time Onboarding to First Insights

1. Sign in → receive JWT (role: Learner)
2. Consent screen (privacy/GDPR) → confirm scopes
3. Landing on Dashboard Shell (SWR): skeleton layout + "Analyzing your learning data…"
4. Pipeline runs (Stages 1‑3); panels hydrate as views refresh
5. Explore key analytics: learning velocity, skill gaps, engagement
6. Generate first report (PDF/CSV) and share/export
7. Optional: Ask AI for "3 actions to improve this week"

Success criteria:
- Insights visible within 45s on first run; clear progress indicators
- No empty white screens; every panel has a meaningful placeholder
- Report generated with consistent totals vs on‑screen metrics

### L2 — Returning Daily Check‑In

1. Sign in → role reminder (Learner) → Dashboard loads from cache
2. Panels show last‑updated; background refresh begins
3. Notifications: new completions, streaks, at‑risk signals
4. AI tip of the day based on recent activity

Success criteria:
- Time‑to‑interactive ≤ 2s; visual refresh indicators per section
- No blocking spinners; user can navigate while data updates

### L3 — Learning Path Review & Adjustment (Topic‑Based)

1. Open Learning Path → view acquired vs pending topics
2. Inspect skill→topic mapping and blockers
3. Accept AI recommendation to reorder next 3 topics
4. Save plan → immediate reflection in "Next Up" widget

Success criteria:
- Topic counts match analytics; recommendations are contextual and reversible

---

## 👩‍🏫 Trainer Journeys

### T1 — Course Health Monitoring

1. Switch to Trainer role → course selector
2. View cohort funnel, completion rate, assessment distribution
3. Drill into outliers; tag follow‑up actions
4. Export course snapshot report

Success criteria:
- Cohort metrics consistent with raw counts; exports match on‑screen aggregates

### T2 — At‑Risk Learner Identification

1. Open "At‑Risk" panel → sorted by risk score
2. Filter by segment (e.g., week 3 beginners)
3. Generate intervention list; optionally notify LMS

Success criteria:
- Deterministic ordering; filters persist; audit trail recorded

---

## 🏢 Organization Manager (HR) Journeys

### O1 — Team Analytics Overview

1. Switch to Org Manager role → team dashboard
2. View engagement heatmap, skills coverage, progress deltas
3. Compare cohorts; download executive summary

Success criteria:
- Anonymized peer comparisons; no PII leaks; reproducible summary totals

### O2 — Compliance & Evidence

1. Open compliance view → mandatory course completion status
2. Export evidence pack (time‑stamped)

Success criteria:
- Exports are signed/dated; totals agree with course systems

---

## 🛠️ Platform Admin Journeys

### A1 — System Health & Data Freshness

1. Open Admin panel → storage usage, materialized views freshness
2. Manually trigger refresh for lagging views (if needed)
3. Review error budgets and slow queries

Success criteria:
- All views within freshness SLOs; refreshes are idempotent and observable

### A2 — RBAC & Role Validation

1. Inspect a multi‑role user’s access → verify scope boundaries
2. Run audit log query; export access report

Success criteria:
- No cross‑role data leakage; audit logs complete and consistent

---

## 🔁 Multi‑Role Journey (Seamless Switching)

1. User opens role switcher (Learner ↔ Trainer ↔ Org Manager ↔ Admin)
2. Context switch without re‑auth; dashboard rebinds to role‑scoped data
3. Prior filters preserved where applicable; cross‑role comparison is anonymized

Success criteria:
- Switch round‑trip ≤ 1s; no residue of prior role data visible

---

## ⚠️ Error & Edge States

- Partial Data: Panels show scoped placeholders and last successful snapshot
- Long‑Running Batches: Offer "Email me when ready" and non‑blocking navigation
- Upstream Outage (one microservice): Panel degraded with provenance note
- Permission Denied: Explain role scope and offer role switch
- GDPR Requests in Progress: Temporarily suppress personal insights with status notice

---

## 📏 Quality Gates & Metrics

- Performance: TTFI ≤ 2s; first‑time full hydration ≤ ~45s
- Freshness: Materialized views within SLOs per category
- Consistency: Export totals match visible aggregates
- Privacy: Zero PII in peer comparisons; consent captured and auditable
- Observability: Every user action emits trace + audit logs with correlation IDs

---

## 🔗 Mapping to Tests & APIs

- E2E coverage: see `05-Testing-TDD/03-System-Tests-Design/E2E-Tests-Complete.md` (Learner, Trainer, Org, Admin, Multi‑Role paths)
- Feature tests: see `05-Testing-TDD/01-Test-Designs/` (Data collection, Batch processing, AI insights)
- APIs: `02-API-Documentation/API-Overview.md` and role UX APIs in `02-API-Documentation/User-Experience-APIs.md`

---

## ✅ Definition of Done (User Journey)

- Journeys render correctly across roles with SWR hydration
- Edge states covered with actionable UX
- Tests passing for critical paths; exports consistent
- Observability and audit complete; RBAC enforced


