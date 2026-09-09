import type { Metadata } from "next";
import {
  LandingAiShowcase,
  LandingComparison,
  LandingCta,
  LandingFooter,
  LandingHero,
  LandingMarketplaceGrid,
  LandingNavbar,
  LandingPipelinePreview,
  LandingRolesSection,
  LandingTestimonials,
} from "@/components/landing";

export const metadata: Metadata = {
  title: "Career Graph - AI Job Marketplace & Autonomous Application Tracker",
  description:
    "Discover high-fit roles across top tech marketplaces. Run automated ATS resume fit scores, extract job data with 1 click, and craft tailored cover letters in seconds.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-blue-500 selection:text-white">
      {/* Sticky Top Navigation */}
      <LandingNavbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with Marketplace Search & Match Bar */}
        <LandingHero />

        {/* AI Superpowers Showcase (Fit Analyzer, Extractor, Cover Letters, Resumes) */}
        <LandingAiShowcase />

        {/* Curated Job Marketplace Directory Preview */}
        <LandingMarketplaceGrid />

        {/* Application Pipeline Kanban Preview */}
        <LandingPipelinePreview />

        {/* Traditional Job Search vs Career Graph Comparison */}
        <LandingComparison />

        {/* Role-Based Workflows (Seeker, Recruiter, Employer, Admin) */}
        <LandingRolesSection />

        {/* Social Proof & Testimonials */}
        <LandingTestimonials />

        {/* High-Converting Call to Action */}
        <LandingCta />
      </main>

      {/* Comprehensive Marketplace Footer */}
      <LandingFooter />
    </div>
  );
}
