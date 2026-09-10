"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Route-to-Page Title mapping for Career Graph.
 * When navigating, the browser tab bar updates automatically.
 */
const PROJECT_NAME = "Career Graph";
const PROJECT_SLOGAN = "Track. Apply. Grow.";
const HOME_TITLE = `${PROJECT_NAME} - ${PROJECT_SLOGAN}`;

/**
 * Route-to-Page Title mapping for Career Graph.
 * When navigating, the browser tab bar updates automatically.
 */
const ROUTE_TITLES: Record<string, string> = {
  "/": HOME_TITLE,
  "/dashboard": "Dashboard",
  "/ats-checker": "ATS Resume Checker",
  "/job-market": "Job Market",
  "/cover-letters": "AI Cover Letters",
  "/resumes": "My Resumes",
  "/applications": "Applications",
  "/applications/new": "New Application",
  "/fit-analysis": "AI Job Fit Analysis",
  "/fit-analysis/result": "Job Fit Match Report",
  "/pricing": "Pricing",
  "/profile": "User Profile",
  "/settings": "Account Settings",
  "/users": "User Management",
  "/wishlist": "Wishlist",
  "/login": "Sign In",
  "/register": "Create Account",
  "/verify-otp": "Verify Email",
};

/**
 * Helper hook allowing any page or modal to dynamically set a custom title.
 * e.g., useDocumentTitle("Senior Software Engineer at Stripe")
 */
export function useDocumentTitle(title?: string | null) {
  useEffect(() => {
    if (!title) return;
    document.title = `${title} - ${PROJECT_NAME}`;
  }, [title]);
}

/**
 * Global component placed in Providers to automatically synchronize
 * the browser tab bar title with Next.js client-side navigation.
 * Eliminates the need for react-helmet-async in Next.js App Router.
 */
export function PageTitleManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    if (pathname === "/") {
      document.title = HOME_TITLE;
      return;
    }

    // 1. Direct exact match
    let pageTitle = ROUTE_TITLES[pathname];

    // 2. Dynamic route matches
    if (!pageTitle) {
      if (
        pathname.startsWith("/applications/") &&
        pathname !== "/applications/new"
      ) {
        pageTitle = "Application Details";
      } else if (pathname.startsWith("/job-market/")) {
        pageTitle = "Job Details";
      } else if (pathname.startsWith("/cover-letters/")) {
        pageTitle = "Cover Letter View";
      } else {
        // Fallback: capitalize the last path segment
        const segments = pathname.split("/").filter(Boolean);
        const lastSegment = segments[segments.length - 1];
        if (lastSegment) {
          pageTitle = lastSegment
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
        }
      }
    }

    // 3. Apply to document.title
    if (pageTitle) {
      document.title = `${pageTitle} - ${PROJECT_NAME}`;
    }
  }, [pathname]);

  return null;
}
