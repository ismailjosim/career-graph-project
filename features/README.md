# Career Graph - Market Analysis & Strategic Feature Roadmap

## 1. Executive Summary

**Career Graph** is currently built as a modern, AI-powered career companion that combines:
- An internal **Job Portal** with dynamic requirement-based token pricing
- AI-assisted **Cover Letter Architecture**
- AI-driven **Resume Fit Analysis**
- An automated **ATS Checker**
- A **Job Application Tracker** and **Wishlist**
- Built on **Next.js 16 (App Router), React 19, Tailwind CSS v4, MongoDB / Mongoose, and Better Auth**

To elevate Career Graph from a functional prototype to an **industry-defining, viral career operating system** that outshines market leaders like **TealHQ, Simplify.jobs, Huntr, Jobscan, and Final Round AI**, this directory outlines 10 high-impact, market-differentiating feature specifications.

---

## 2. Competitive Landscape Matrix

| Feature Dimension | TealHQ | Simplify.jobs | Huntr | Jobscan | Final Round AI | **Career Graph (Proposed)** |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Browser Job Clipper** | Yes (40+ sites) | Yes | Yes | Limited | No | **Yes (feat-01)** |
| **1-Click Application Autofill** | Basic | Industry Leader | No | No | No | **Yes (feat-01)** |
| **Live Side-by-Side Resume Builder** | Yes | No | Basic | Premium | No | **Yes (feat-02)** |
| **Dynamic ATS Keyword Scoring** | Basic | No | No | Industry Leader | No | **Yes (feat-02)** |
| **Voice & Text AI Mock Interviewer**| No | No | No | No | Industry Leader | **Yes (feat-03)** |
| **Cold Outreach & Networking CRM** | Basic | No | Contacts only | No | No | **Yes (feat-04)** |
| **Compensation & Offer Negotiation**| Basic | Community | No | No | No | **Yes (feat-05)** |
| **Kanban Pipeline + Calendar Sync** | Yes | Basic | Industry Leader | No | No | **Yes (feat-06)** |
| **Automated Job Ingestion Engine** | Aggregated | Aggregated | No | No | No | **Yes (feat-07)** |
| **Referral Marketplace & Peer Network**| No | Community | No | No | No | **Yes (feat-08)** |
| **Gmail/Outlook Auto-Tracker Sync** | Yes | Yes | Yes | No | No | **Yes (feat-09)** |
| **Token Economy & Fair Pay-as-You-Go**| Sub only | Free/Sub | Sub only | Sub only | Expensive Sub | **Hybrid Token + Pro (feat-10)** |

---

## 3. Directory of Strategic Features

Click any feature below to inspect the detailed technical design, architectural diagrams, API schemas, and implementation roadmap:

1. [feat-01: Chrome Extension & 1-Click Job Clipper & Autofill](./feat-01.md)
   *Capture jobs from 50+ platforms with 1 click; auto-fill complex ATS job applications (Workday, Greenhouse, Lever, Ashby).*

2. [feat-02: Interactive AI Resume Builder & Live ATS Side-by-Side Editor](./feat-02.md)
   *Real-time split-screen resume builder with STAR bullet-point enhancer and live ATS keyword density gauge.*

3. [feat-03: AI Voice & Audio Mock Interview Simulator (STAR Coach)](./feat-03.md)
   *Real-time audio/text behavioral and technical interview simulation tailored to the target job requirements.*

4. [feat-04: Recruiter & Networking Outreach Copilot (Cold Email & LinkedIn CRM)](./feat-04.md)
   *Automated personalized outreach generator for hiring managers, recruiters, and alumni, with follow-up cadences.*

5. [feat-05: Salary Benchmarking & Offer Negotiation Intelligence Engine](./feat-05.md)
   *Levels.fyi-grade compensation benchmarking, total compensation breakdowns, and AI counter-offer negotiation scripts.*

6. [feat-06: Advanced Drag-and-Drop Kanban CRM with Calendar & Task Sync](./feat-06.md)
   *Full drag-and-drop pipeline with Google/Outlook Calendar synchronization for interview rounds and follow-up alerts.*

7. [feat-07: Automated Multi-Source Job Aggregator Engine (Greenhouse/Lever/Ashby APIs)](./feat-07.md)
   *High-frequency background ingestor tracking thousands of verified tech, design, and remote roles daily.*

8. [feat-08: Community Employee Referral Marketplace & Peer Review Network](./feat-08.md)
   *Crowdsourced verified company referrals and token-incentivized anonymous resume peer reviews.*

9. [feat-09: Automated Email Inbox Application Sync (Gmail / Outlook OAuth)](./feat-09.md)
   *Zero-manual-entry pipeline updating: auto-detects application confirmations, interview invitations, and status changes from emails.*

10. [feat-10: Multi-LLM Dynamic Routing, Progressive Web App (PWA) & Offline Privacy Architecture](./feat-10.md)
    *Intelligent model routing (Gemini 2.5 Flash + Claude 3.5 Sonnet + GPT-4o), offline PWA with mobile push notifications, and client-side encryption.*

---

## 4. Implementation Priority Matrix

```mermaid
quadrantChart
    title Feature Impact vs Complexity
    x-axis Low Complexity --> High Complexity
    y-axis Low Impact --> High Impact
    quadrant-1 Strategic Bets
    quadrant-2 Quick Wins (High Priority)
    quadrant-3 Nice to Have
    quadrant-4 Complex Core
    "feat-01 (Chrome Ext)": [0.65, 0.95]
    "feat-02 (AI Resume Builder)": [0.70, 0.92]
    "feat-03 (AI Mock Interviewer)": [0.80, 0.88]
    "feat-04 (Outreach Copilot)": [0.35, 0.78]
    "feat-05 (Salary Intelligence)": [0.45, 0.72]
    "feat-06 (Kanban Calendar Sync)": [0.40, 0.85]
    "feat-07 (Job Aggregator Engine)": [0.55, 0.80]
    "feat-08 (Referral Marketplace)": [0.75, 0.65]
    "feat-09 (Email Inbox Sync)": [0.60, 0.83]
    "feat-10 (Multi-LLM & PWA)": [0.50, 0.75]
```
