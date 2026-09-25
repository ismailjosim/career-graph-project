import {
  Briefcase,
  FileCheck,
  FileEdit,
  FileText,
  Link2,
  Sparkles,
} from "lucide-react";

export interface PricingPackage {
  id: "starter" | "pro" | "ultra";
  name: string;
  price: string;
  priceNum: number;
  tokens: number;
  badge: string | null;
  bonus: string | null;
  costPerToken: string;
  description: string;
  features: string[];
  ctaText: string;
  popular: boolean;
  recommendedFor: number;
}

export const packages: PricingPackage[] = [
  {
    id: "starter",
    name: "Starter Pack",
    price: "$5",
    priceNum: 5,
    tokens: 500,
    badge: null,
    bonus: null,
    costPerToken: "$0.010",
    description:
      "Perfect for active job seekers targeting 10–15 curated job applications.",
    features: [
      "500 AI Diamond Tokens",
      "~12 Complete Application Suites",
      "Up to 50 Standalone ATS Resume Audits",
      "Or up to 25 AI Cover Letters",
      "Tokens never expire (Lifetime)",
      "Instant Word & PDF Exports",
    ],
    ctaText: "Get 500 Tokens",
    popular: false,
    recommendedFor: 10,
  },
  {
    id: "pro",
    name: "Pro Pack",
    price: "$10",
    priceNum: 10,
    tokens: 1150,
    badge: "Most Popular",
    bonus: "+150 Free Tokens (15% Bonus)",
    costPerToken: "$0.0087",
    description:
      "The sweet spot for candidates running multi-stage job search campaigns.",
    features: [
      "1,150 AI Diamond Tokens",
      "~28 Complete Application Suites",
      "Up to 115 Standalone ATS Audits",
      "Or up to 57 AI Cover Letters",
      "Priority AI Engine",
      "Tokens never expire (Lifetime)",
      "Job Description link extraction",
    ],
    ctaText: "Get 1,150 Tokens",
    popular: true,
    recommendedFor: 25,
  },
  {
    id: "ultra",
    name: "Ultra Value",
    price: "$20",
    priceNum: 20,
    tokens: 2600,
    badge: "Best Value",
    bonus: "+600 Free Tokens (30% Bonus)",
    costPerToken: "$0.0076",
    description:
      "Maximum tokens for power job seekers, career coaches, or long-term pipelines.",
    features: [
      "2,600 AI Diamond Tokens",
      "~65 Complete Application Suites",
      "Up to 260 Standalone ATS Audits",
      "Or up to 130 AI Cover Letters",
      "Full ATS 4-Pillar deep audit",
      "Tokens never expire (Lifetime)",
      "VIP Priority Support & speed",
    ],
    ctaText: "Get 2,600 Tokens",
    popular: false,
    recommendedFor: 50,
  },
];

export const featureCosts = [
  {
    name: "ATS Resume Checker",
    icon: FileCheck,
    color: "text-blue-500",
    cost: "10 Tokens",
    dollar: "$0.10",
    detail:
      "4-Pillar audit (Formatting, Keywords, Impact, Structure) + PDF/Word export",
  },
  {
    name: "AI Cover Letter Architect",
    icon: FileText,
    color: "text-purple-500",
    cost: "20 Tokens",
    dollar: "$0.20",
    detail:
      "Tailored to full job post requirements with customizable voice and tone",
  },
  {
    name: "AI Job Fit Analysis",
    icon: Sparkles,
    color: "text-indigo-500",
    cost: "10 Tokens",
    dollar: "$0.10",
    detail:
      "0-100% role qualification match with missing skills & interview prep",
  },
  {
    name: "Tailored Resume Rewrite",
    icon: FileEdit,
    color: "text-emerald-500",
    cost: "25 Tokens",
    dollar: "$0.25",
    detail:
      "Generates customized bullet points and keyword alignment tailored to a role",
  },
  {
    name: "Job Portal 1-Click Apply",
    icon: Briefcase,
    color: "text-amber-500",
    cost: "10 Tokens",
    dollar: "$0.10",
    detail:
      "Direct verified platform application with recruiter-matched criteria",
  },
  {
    name: "1-Click Job Link Extraction",
    icon: Link2,
    color: "text-cyan-500",
    cost: "5 Tokens",
    dollar: "$0.05",
    detail:
      "Scrapes title, company, salary & full job spec from any external URL",
  },
];

export const comparisons = [
  {
    feature: "Cost Model",
    careerGraph: "Pay-As-You-Go ($5–$20 one-time)",
    legacy: "Monthly Subscription ($29–$49.95/mo)",
    winner: true,
  },
  {
    feature: "Token / Credit Expiration",
    careerGraph: "Never Expire (Lifetime Validity)",
    legacy: "Expires or resets every 30 days",
    winner: true,
  },
  {
    feature: "Cost for a 2-Month Job Search",
    careerGraph: "$10 (Pro Pack with 1,150 tokens)",
    legacy: "$60 – $100+ (Recurring auto-charge)",
    winner: true,
  },
  {
    feature: "Automatic Credit Card Renewals",
    careerGraph: "Zero (No surprise billing ever)",
    legacy: "Automatic recurring renewal",
    winner: true,
  },
  {
    feature: "Free Welcome Access",
    careerGraph: "70 Free Tokens (No credit card)",
    legacy: "5 basic scans or requires card upfront",
    winner: true,
  },
  {
    feature: "Custom Job Tailoring & Cover Letter",
    careerGraph: "Included in single unified balance",
    legacy: "Requires higher-tier add-on plans",
    winner: true,
  },
];
