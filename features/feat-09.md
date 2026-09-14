# feat-09: Automated Email Inbox Application Sync (Gmail / Outlook OAuth)

## 1. Executive Summary

The primary failure point of job tracking systems is **manual data entry fatigue**. When candidates apply to 40+ positions, manually logging interview invites, HackerRank assessments, follow-ups, and rejection emails becomes unsustainable.

**feat-09** introduces the **Zero-Friction Email Inbox Auto-Tracker (Gmail & Microsoft Outlook OAuth)**:
1. **OAuth 2.0 Read-Only Mailbox Sync**: Secure, privacy-first connection to candidate's Gmail or Outlook inbox, listening only for transactional messages from recognized ATS domains (`greenhouse.io`, `lever.co`, `myworkday.com`, `ashbyhq.com`, `smartrecruiters.com`, `taleo.net`).
2. **AI Email Classifier & Action Extractor**:
   - Detects **Application Confirmations**: Automatically creates an application card in the `"applied"` column.
   - Detects **Interview Invitations**: Automatically extracts interviewers, Zoom/Google Meet links, and dates, scheduling them onto the candidate's Career Graph calendar.
   - Detects **Take-Home Tests & Assessments**: Logs HackerRank/CodeSignal deadlines and links.
   - Detects **Rejections**: Gracefully moves applications to `"rejected"` without candidate friction.
   - Detects **Offer Letters**: Moves application to `"offer_received"` and alerts the candidate to launch the Negotiation Engine.

---

## 2. Competitive Advantage (Why This Outshines the Market)

- **Huntr / Teal Comparison**: Huntr has an email forwarder address, but forwarding emails manually is tedious. Teal charges an enterprise-level tier for direct inbox sync.
- **The Career Graph Differentiator**:
  - Uses localized, read-only AI classification that inspects only headers matching known ATS sender domains.
  - Automatically ties incoming emails into **feat-03 (AI Mock Interviewer)** (e.g. *"We detected you have an interview with Stripe on Friday. Practice with Sarah AI now!"*).

---

## 3. Data Flow & Email Processing Pipeline

```mermaid
flowchart TD
    Gmail[Candidate Gmail / Outlook] -->|Google Cloud Pub/Sub Webhook| Webhook[/api/webhooks/email-sync]
    Webhook --> Filter{Sender from ATS Domain?}
    Filter -->|No: Personal Email| Discard[Immediate Discard / Zero Retention]
    Filter -->|Yes: greenhouse, lever, workday| Classifier[Gemini Email Classifier]
    
    Classifier --> Type{Classification}
    Type -->|Interview Invite| Step1[Extract Date & Zoom Link -> Sync to Calendar]
    Type -->|Rejection| Step2[Update Stage to Rejected]
    Type -->|Offer Received| Step3[Trigger Salary Negotiation Alert]
    Type -->|Confirmation| Step4[Auto-Create Application Card]

    Step1 --> DB[(Career Graph Application DB)]
    Step2 --> DB
    Step3 --> DB
    Step4 --> DB
```

---

## 4. Technical Architecture

### 4.1 OAuth Scopes & Permissions
- **Google Cloud Platform**: `https://www.googleapis.com/auth/gmail.readonly` (Restricted to read-only access with Google Verification / CASA Tier 2 compliance).
- **Microsoft Graph**: `Mail.Read` scope for Outlook and Office 365.

### 4.2 Webhook Handler & Email Classification
- **Endpoint**: `POST /api/webhooks/email-sync/google`
- **Classification Categories**:
  ```typescript
  export type EmailCategory = 
    | "application_confirmation"
    | "interview_invitation"
    | "technical_assessment"
    | "rejection"
    | "offer"
    | "general_communication";

  export interface ParsedEmailEvent {
    company: string;
    roleTitle?: string;
    category: EmailCategory;
    interviewDate?: Date;
    meetingUrl?: string;
    assessmentDeadline?: Date;
    senderEmail: string;
    emailSnippet: string;
  }
  ```

---

## 5. Privacy, Security & Token Economy
- **Privacy Standard**: Zero retention of personal email bodies. Email text is parsed in memory, mapped to metadata, and immediately garbage-collected.
- **Token Economy**:
  - Connecting mailbox & automatic status updates: **Free**.
  - Automated Zoom interview extraction & calendar scheduling: **Included in Pro / 5 Tokens for free tier**.

---

## 6. Implementation Roadmap
1. **Sprint 1**: Set up Google Cloud OAuth App credentials and Better Auth Google/Microsoft mail provider link.
2. **Sprint 2**: Build the Pub/Sub push subscription webhook handler.
3. **Sprint 3**: Implement the ATS domain allowlist filter (120+ top hiring systems).
4. **Sprint 4**: Develop the Gemini extraction prompt and connect it to automatic Kanban stage transitions.
