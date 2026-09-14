# feat-04: Recruiter & Networking Outreach Copilot (Cold Email & LinkedIn CRM)

## 1. Executive Summary

Applying through standard public application portals often results in candidates competing against 1,500+ applicants. **Over 70% of high-paying tech jobs are filled through direct outreach and networking**. Yet, most candidates struggle with:
- Finding who the hiring manager or recruiter is
- Writing non-spammy, high-converting cold emails
- Adhering to LinkedIn's strict 300-character connection request limits
- Remembering to send timely follow-up nudges

**feat-04** introduces the **Career Graph Networking & Outreach Copilot**:
1. **Multi-Channel Message Generator**: Generates concise, punchy messages tailored to:
   - **LinkedIn Connection Requests** (Strict 300-character limit optimizer)
   - **Hiring Manager Cold Emails** (Hook + value proposition + candidate proof point + low-friction ask)
   - **Alumni / Peer Coffee Chat Requests**
   - **Post-Interview Thank You Notes**
2. **Company Email Pattern Guesser**: Suggests verified corporate email syntax (e.g., `{first}.{last}@stripe.com`, `{first_initial}{last}@google.com`).
3. **Contact Relationship CRM**: Logs recruiters and team members directly attached to each job application with automated follow-up cadences.

---

## 2. Competitive Advantage (Why This Outshines the Market)

- **TealHQ Comparison**: Teal offers a contact list, but requires manual message drafting or generates generic boilerplate copy.
- **Hunter.io / Apollo Comparison**: Enterprise-focused sales tools that overwhelm job seekers with complex sequences.
- **The Career Graph Differentiator**:
  - The message generator automatically cross-references the candidate's **Resume** and the **Target Job Requirements** to cite specific matching achievements (e.g. *"I noticed Stripe is scaling its distributed ledger; at my last role I optimized transaction latency by 24%..."*).
  - Built directly into the application tracker.

---

## 3. UI Concept & Outreach Generator

```
+-----------------------------------------------------------------------------------------------+
| Outreach Copilot: Staff Backend Engineer at Stripe                                             |
+-----------------------------------------------------------------------------------------------+
| Target Recruiter: Sarah Jenkins (Technical Recruiter at Stripe)                               |
| Email Pattern Suggestion: sjenkins@stripe.com (Confidence: 94%)                               |
|                                                                                               |
| Select Channel:                                                                               |
| [ LinkedIn Note (300 char) ]  [ Cold Email ]  [ Alumni Request ]  [ Thank You Note ]          |
|                                                                                               |
| Generated LinkedIn Note (274 / 300 characters):                                               |
| +-------------------------------------------------------------------------------------------+ |
| | Hi Sarah, saw Stripe is expanding Payments Core. Having scaled high-throughput Go ledgers | |
| | processing $10M+ daily at my prior company, I'd love to connect and learn about what your  | |
| | team is building for multi-region settlements. Thanks!                                    | |
| +-------------------------------------------------------------------------------------------+ |
|                                                                                               |
| [ Copy to Clipboard ]  [ ⚡ Open LinkedIn Profile ]  [ ✉ Send via Mail App ]                   |
|                                                                                               |
| Next Step:                                                                                    |
| [x] Set follow-up reminder for 4 days from now (Thursday, Sept 18)                           |
+-----------------------------------------------------------------------------------------------+
```

---

## 4. Technical Architecture

### 4.1 Database Schema (`src/lib/models.ts`)
```typescript
export interface IJobContact {
  _id?: string;
  userId: string;
  applicationId?: string; // Link to JobApplication
  companyName: string;
  name: string;
  title: string;
  email?: string;
  linkedinUrl?: string;
  status: "identified" | "contacted" | "replied" | "call_scheduled" | "referred";
  outreachLog: Array<{
    date: Date;
    channel: "linkedin" | "email" | "twitter" | "referral";
    messageSubject?: string;
    messageBody: string;
  }>;
  followUpDate?: Date;
  notes?: string;
  createdAt: Date;
}
```

### 4.2 AI Outreach Generation Endpoint
- **Endpoint**: `POST /api/ai/outreach/generate`
- **Cost**: 3 tokens per generation request.
- **Payload**:
  ```typescript
  interface OutreachGenerateRequest {
    jobId?: string;
    roleTitle: string;
    companyName: string;
    recipientName: string;
    recipientRole: "recruiter" | "hiring_manager" | "peer" | "alumni";
    channel: "linkedin_note" | "cold_email" | "alumni_intro" | "thank_you";
    tone: "concise" | "enthusiastic" | "executive";
    specificDiscussionPoints?: string; // For thank you notes
  }
  ```

---

## 5. Token Economy & Monetization
- **Generating Outreach Messages**: 3 tokens per batch.
- **Contact Management & Follow-up Calendar**: Free feature included in application tracking.

---

## 6. Implementation Roadmap
1. **Sprint 1**: Create the `JobContact` Mongoose model and REST APIs (`/api/contacts`).
2. **Sprint 2**: Build the Outreach Copilot modal with character counting and copy-to-clipboard functionality.
3. **Sprint 3**: Connect the Gemini prompt template with candidate resume context for personalized achievement insertion.
4. **Sprint 4**: Integrate automated follow-up reminders into the dashboard alerts system.
