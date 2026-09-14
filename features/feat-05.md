# feat-05: Salary Benchmarking & Offer Negotiation Intelligence Engine

## 1. Executive Summary

Candidates routinely leave **$10,000 to $65,000 on the table** during job transitions due to lack of transparent compensation data, fear of offer rescission, or uncertainty regarding how to structure a counter-offer. While platforms like Levels.fyi provide data points, they do not guide the candidate through the actual psychological negotiation dialogue.

**feat-05** introduces the **Career Graph Salary & Offer Negotiation Intelligence Engine**:
1. **Real-Time Compensation Benchmarks**: Interactive salary curves by role, seniority, location, and workplace model (Remote / Hybrid / NYC / SF / London), displaying 25th, 50th, 75th, and 90th percentiles.
2. **Total Compensation (TC) Calculator**: Deconstructs complex offers across Base Salary, Performance Bonus, Equity (RSUs / Stock Options with 4-year vesting schedules), and Sign-on Bonuses.
3. **Offer Leverage Analyzer**: Evaluates whether an offer is below, at, or above market, highlighting key negotiation levers (e.g., competing offers, missing benefits, below-median equity).
4. **AI Counter-Offer Email Architect**: Generates polite, diplomatic, yet firm negotiation emails and counter-proposals that maximize compensation without risking offer rescission.

---

## 2. Competitive Advantage (Why This Outshines the Market)

- **Levels.fyi Comparison**: Excellent raw data, but offers zero personalized counter-offer drafting or direct integration with the candidate's application pipeline.
- **Negotiation Coaches Comparison**: Human coaches charge $1,500 to $4,000 or a percentage of compensation increase.
- **The Career Graph Differentiator**:
  - Automatically activates when a job in the pipeline moves to `"offer_received"`.
  - Factors in the exact company culture (e.g., Stripe's known preference for higher equity vs Google's bonus tiers).
  - Integrated into Career Graph's **Token Economy**.

---

## 3. Total Compensation Calculator & Negotiation Flow

```
+-----------------------------------------------------------------------------------------------+
| Offer Evaluation: Senior Backend Engineer at Vercel                                          |
+-----------------------------------------------------------------------------------------------+
| Base Salary: $165,000        | Market Median: $185,000 (▲ 12% Below Median)                   |
| Sign-on Bonus: $15,000       | Equity (4-yr RSU): $140,000 ($35,000 / yr)                     |
| Annual Bonus (15%): $24,750  | Year 1 Total Comp: $239,750                                    |
+-----------------------------------------------------------------------------------------------+
| LEVERAGE SCORE: HIGH (82/100)                                                                 |
| Strengths: Candidate has 2 active interviews in final round; base is in the 35th percentile. |
+-----------------------------------------------------------------------------------------------+
| Select Counter-Offer Strategy:                                                                |
| ( ) Market Benchmark Pivot (Ask for $180k Base)                                               |
| (*) Competing Offer Leverage (Cite competing $250k TC)                                        |
| ( ) Equity Maximization (Trade bonus for additional equity)                                   |
|                                                                                               |
| [ ✨ Generate Counter-Offer Email ]                                                           |
| Generated Script:                                                                             |
| "Hi Emily, thank you so much for the offer to join Vercel! I am genuinely thrilled about     |
|  the opportunity to lead platform initiatives. To be transparent, I am in the final stages... |
|  If we can bring the base salary to $180,000, I would be thrilled to sign immediately."       |
+-----------------------------------------------------------------------------------------------+
```

---

## 4. Technical Architecture

### 4.1 Compensation Benchmark Schema (`src/lib/models.ts`)
```typescript
export interface ISalaryBenchmark {
  _id?: string;
  roleTitle: string;
  department: "engineering" | "product" | "design" | "marketing" | "sales" | "data";
  experienceLevel: "entry" | "mid" | "senior" | "lead" | "executive";
  location: string;
  country: string;
  currency: string;
  percentile25: number;
  percentile50: number; // Median
  percentile75: number;
  percentile90: number;
  sampleSize: number;
  updatedAt: Date;
}
```

### 4.2 Counter-Offer Generator API
- **Endpoint**: `POST /api/ai/negotiation/generate-counter`
- **Cost**: 8 tokens.
- **Payload**:
  ```typescript
  interface CounterOfferRequest {
    jobTitle: string;
    companyName: string;
    initialOffer: {
      baseSalary: number;
      signOnBonus?: number;
      equityValue?: number;
      vestingYears?: number;
      performanceBonusPercent?: number;
    };
    competingOffers?: Array<{
      company: string;
      totalComp: number;
    }>;
    strategy: "market_rate" | "competing_offer" | "equity_focus" | "remote_flexibility";
    tone: "diplomatic" | "confident" | "enthusiastic";
  }
  ```

---

## 5. Token Economy & Monetization
- **Viewing Salary Curve**: Free for all users.
- **Full Total Compensation Breakdown & Leverage Audit**: 5 tokens.
- **Generating Tailored Counter-Offer Scripts**: 8 tokens.

---

## 6. Implementation Roadmap
1. **Sprint 1**: Seed baseline compensation benchmarks for primary tech/product/design roles across US/EU/Remote.
2. **Sprint 2**: Build the interactive TC Calculator component with Recharts visualization for 4-year vesting horizons.
3. **Sprint 3**: Implement the Offer Leverage Analyzer with risk assessment indicators.
4. **Sprint 4**: Develop the AI Counter-Offer generator with instant email export.
