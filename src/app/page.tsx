import type { Metadata } from "next";
import {
  LandingCta,
  LandingDailyMatchesPreview,
  LandingFooter,
  LandingHero,
  LandingMarketplaceGrid,
  LandingNavbar,
  LandingPipelinePreview,
  LandingPricing,
} from "@/components/landing";

export const metadata: Metadata = {
  title: "Career Graph - Find Jobs Matched to Your Resume Daily",
  description:
    "Discover high-fit roles scraped daily from top job boards. Get 10–15 curated matches delivered directly to your resume with automated tracking.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <LandingNavbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Minimalist Indeed-style Job Search Hero */}
        <LandingHero />

        {/* Daily Scraped 10-15 Matches Feature Showcase */}
        <LandingDailyMatchesPreview />

        {/* Live Marketplace Directory Preview */}
        <LandingMarketplaceGrid />

        {/* Kanban Application Pipeline Tracker */}
        <LandingPipelinePreview />

        {/* Transparent Monthly Subscription Pricing */}
        <LandingPricing />

        {/* Clean Call to Action */}
        <LandingCta />
      </main>

      {/* Clean Footer */}
      <LandingFooter />
    </div>
  );
}
