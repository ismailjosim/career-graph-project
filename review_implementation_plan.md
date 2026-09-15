# Implementation Plan: Dynamic Reviews & Testimonials System

Implement a verified, role-based dynamic review system for **Job Seekers**, **Recruiters**, and **Employers** with a **"One Review Per User" (with edit capability)** policy, database persistence, public API endpoints, and dynamic landing page presentation.

---

## 1. User Rule Evaluation: One Review Per User Lifetime

### Verdict: **Excellent approach with a key refinement (Upsert / Editable)**
- **Why it's Good:**
  - **Integrity & Trust:** Prevents review-bombing or artificial inflation. Each verified user gets exactly 1 vote.
  - **Database Simplicity:** Enforces a unique index `{ userId: 1 }` on the database level, preventing race conditions or duplicate entries.
  - **Accurate Platform Metrics:** The calculated average rating and count represent unique people, not duplicate submissions.
- **The Refinement (One review, but user can Edit/Update it):**
  - As a user progresses (e.g., from applying to receiving an offer at Google), they should be able to update their review, role, or rating with their success outcome.
  - **Implementation:** When submitting, the backend will perform an **Upsert**: if a review exists for that `userId`, it updates the existing review rather than rejecting or creating a duplicate.

---

## 2. Proposed Architecture & Changes

### Data & Validation Layer

#### [MODIFY] [validation.ts](file:///c:/Users/ismai/OneDrive/Desktop/Projects/Career-Graph-Project/src/lib/validation.ts)
- Define `reviewSchema` and `submitReviewSchema` using Zod:
  - `role`: enum (`job_seeker`, `recruiter`, `employer`)
  - `rating`: number (1 to 5)
  - `content`: string (minimum 10 characters, max 600 characters)
  - `headline`: string (e.g. "Software Engineer @ Acme" or "Tech Lead")
  - `companyOrTarget`: string (optional, e.g. "Google", "Stripe")
  - `verifiedOutcome`: string (e.g. "Landed role in 3 weeks", "Hired 2 Engineers")
  - `tags`: array of strings (e.g. ["AI Fit Analyzer", "Resume Builder", "Fast Screening"])
  - `status`: enum (`pending`, `approved`, `featured`) with default `approved` (or admin moderation support)

#### [MODIFY] [models.ts](file:///c:/Users/ismai/OneDrive/Desktop/Projects/Career-Graph-Project/src/lib/models.ts)
- Create Mongoose `Review` model:
  - Indexed unique field on `userId` (`userId: { type: String, required: true, unique: true, index: true }`)
  - Fields for user metadata snapshot (`authorName`, `authorImage`, `role`, `rating`, `content`, `tags`, `verifiedOutcome`, `status`)
  - Timestamps (`createdAt`, `updatedAt`)

---

### Backend API Layer

#### [NEW] [route.ts](file:///c:/Users/ismai/OneDrive/Desktop/Projects/Career-Graph-Project/src/app/api/reviews/route.ts)
- **`GET /api/reviews`**:
  - Query parameters: `role` (`all` | `job_seeker` | `recruiter` | `employer`), `limit`, `sort`
  - Returns: List of approved reviews + aggregate summary stats (`averageRating`, `totalReviews`, count by role).
- **`POST /api/reviews`**:
  - Requires authenticated session (`getSessionUser`).
  - Validates input body with `submitReviewSchema`.
  - Performs **Upsert**: updates existing review if user already wrote one, or creates a new one if not.
  - Returns updated review and `isUpdate` flag.

#### [NEW] [route.ts](file:///c:/Users/ismai/OneDrive/Desktop/Projects/Career-Graph-Project/src/app/api/reviews/me/route.ts)
- **`GET /api/reviews/me`**:
  - Returns current user's review if it exists, along with user profile defaults (prefilled role, name, picture).
- **`DELETE /api/reviews/me`**:
  - Allows the user to remove their review if they choose.

---

### Frontend UI Layer

#### [NEW] [ReviewModal.tsx](file:///c:/Users/ismai/OneDrive/Desktop/Projects/Career-Graph-Project/src/components/reviews/ReviewModal.tsx)
- Modern dialog matching 2026 glassmorphism dark/light design system:
  - Dynamic interactive 5-star selector with hover animations.
  - Role switcher (`Job Seeker` / `Recruiter` / `Employer`), defaulting to logged-in user's role.
  - Quick-select tags pills based on role.
  - Text area with character counter.
  - Displays "Edit your review" if the user has already submitted one, or "Share your experience" for first-time reviewers.

#### [MODIFY] [LandingTestimonials.tsx](file:///c:/Users/ismai/OneDrive/Desktop/Projects/Career-Graph-Project/src/components/landing/LandingTestimonials.tsx)
- Upgrade from static hardcoded array to a **dynamic live review engine**:
  - Filter tabs: **All Reviews**, **Job Seekers**, **Recruiters**, **Employers** with live count badges.
  - Rating metrics banner (e.g. `4.9 ★ based on X reviews`).
  - Role-specific badges (`Verified Candidate`, `Verified Recruiter`, `Verified Employer`).
  - "Leave a Review" CTA button that launches `ReviewModal` (prompts login if unauthenticated).
  - Graceful fallback with rich initial reviews if the database has few reviews initially.

---

## 3. Verification Plan

### Automated & Manual Verification
1. **API Testing**:
   - Send `POST /api/reviews` with authenticated user; verify review created.
   - Send second `POST /api/reviews` with same user; verify it **updates** the existing document without creating a 2nd document (verifying 1 review per user).
   - Test `GET /api/reviews` with filtering `?role=job_seeker`, `?role=recruiter`, and `?role=employer`.
   - Test `GET /api/reviews/me` and `DELETE /api/reviews/me`.
2. **UI & End-to-End Testing**:
   - Open Landing Page, verify dynamic testimonials load correctly.
   - Test role tab filtering (`All`, `Job Seekers`, `Recruiters`, `Employers`).
   - Open `ReviewModal`, submit a review with 5 stars, custom tags, and text.
   - Confirm review appears dynamically on the testimonials grid with the correct role badge.
   - Re-open modal, verify previous review is loaded for editing, modify it, and verify changes save.
