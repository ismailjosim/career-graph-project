# feat-06: Advanced Drag-and-Drop Kanban CRM with Calendar & Task Sync

## 1. Executive Summary

Job hunting is essentially a high-stakes personal sales pipeline. Candidates managing 20 to 50 active applications simultaneously suffer from missed deadlines, forgotten interview prep, and lack of follow-up. Currently, Career Graph provides a linear applications list, but lacks a tactile, **visual drag-and-drop CRM experience**.

**feat-06** introduces the **Career Graph Advanced Kanban CRM & Calendar Hub**:
1. **Interactive Drag-and-Drop Pipeline**: Powered by `@dnd-kit`, allowing smooth card movement across customized stages (`Wishlist` -> `Applied` -> `Screening` -> `Tech Assessment` -> `Final Onsite` -> `Offer` -> `Archived`).
2. **Two-Way Calendar Sync**: Direct integration with **Google Calendar, Outlook, and Apple iCal (.ics feeds)** to automatically sync scheduled interview dates and reminders.
3. **Automated Follow-Up Task Engine**: Generates task checklists per stage (e.g., *"Send thank-you note within 24h of onsite"*, *"Follow up if no reply after 5 business days"*).
4. **Comprehensive Application Timeline**: Chronological activity audit log for every application tracking changes in status, contacts logged, and document revisions.

---

## 2. Competitive Advantage (Why This Outshines the Market)

- **Huntr Comparison**: Huntr has a good Kanban, but charges $40/month and has virtually no AI tailoring or native job portal.
- **Notion Job Templates**: Notion requires tedious manual setup, breaks on mobile, and doesn't sync two-way with external calendars or AI tools.
- **The Career Graph Differentiator**:
  - Seamlessly links applications with our **AI Mock Interviewer**, **Cover Letter Architect**, and **ATS Checker**.
  - Provides a real-time calendar view alongside the board view.

---

## 3. Visual Board Architecture

```
+-----------------------------------------------------------------------------------------------------------------------+
| APPLICATIONS CRM  [ Board View ] [ Calendar View ] [ List View ]           [ + Add Custom Job ] [ ⚙ Column Settings ]  |
+-----------------------------------------------------------------------------------------------------------------------+
| WISHLIST (4)         APPLIED (8)            SCREENING (2)          INTERVIEWS (3)         OFFERS (1)                  |
+--------------------+ +--------------------+ +--------------------+ +--------------------+ +--------------------+     |
| [Stripe]           | | [Vercel]           | | [Anthropic]        | | [OpenAI]             | | [Figma]            |     |
| Staff Backend Eng  | | Sr Full Stack Eng  | | Senior AI Eng      | | Staff Systems Eng    | | Product Designer   |     |
| $180k - $240k      | | $165k              | | Screen: Sep 18     | | Onsite: Sep 22       | | Offer: $170k TC    |     |
| Match: 92%         | | Applied 4d ago     | | Contact: Mike T.   | | Panel: 4 Rounds      | | [ ⚡ Negotiate ]   |     |
| [ Apply (10 Tk) ]  | | [ Log Follow-up ]  | | [ Prep Interview ] | | [ Mock Interview ]   | | Decided: Sep 25    |     |
+--------------------+ +--------------------+ +--------------------+ +--------------------+ +--------------------+     |
| [Netflix]          | | [Datadog]          | |                    | |                      |                    |     |
| Senior Platform    | | Solutions Arch     | |                    | |                      |                    |     |
+--------------------+ +--------------------+ +--------------------+ +--------------------+ +--------------------+     |
```

---

## 4. Technical Architecture

### 4.1 Frontend Component Stack
- **Drag and Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` for 60fps accessible drag animations.
- **Calendar Integration**: FullCalendar (`@fullcalendar/react`) or a custom React calendar with month, week, and agenda views.
- **Export**: `.ics` calendar subscription link powered by `ical-generator` for native sync to Apple Calendar, Outlook, and Google Calendar.

### 4.2 Application Stage Enhancements (`src/lib/models.ts`)
```typescript
export interface IApplicationTask {
  id: string;
  title: string;
  dueDate: Date;
  isCompleted: boolean;
  type: "follow_up" | "prep_interview" | "send_thank_you" | "review_offer";
}

export interface IApplicationTimelineEvent {
  id: string;
  timestamp: Date;
  type: "stage_change" | "note_added" | "interview_scheduled" | "outreach_sent";
  description: string;
}
```

### 4.3 Calendar API Endpoints
- **Endpoint**: `GET /api/calendar/events`
  - Returns all scheduled interviews, deadlines, and follow-ups as standard RFC 5545 format or JSON.
- **Endpoint**: `GET /api/calendar/feed/[userId]/token.ics`
  - Dynamic WebCal subscription endpoint enabling live synchronization into candidate's phone/desktop calendar.

---

## 5. Token Economy & Monetization
- **Kanban Board & Custom Columns**: 100% Free for all users.
- **Two-Way iCal Subscription & Unlimited Tasks**: Included in Free/Pro tier.

---

## 6. Implementation Roadmap
1. **Sprint 1**: Refactor `/applications` to implement the `@dnd-kit` multi-column board with optimistic UI state updates.
2. **Sprint 2**: Build the card detail slide-over modal with activity timeline and task checklist.
3. **Sprint 3**: Implement the Calendar view toggle with month/week views.
4. **Sprint 4**: Add the `.ics` calendar feed generation endpoint.
