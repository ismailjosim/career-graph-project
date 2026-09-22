"use client";

import { useEffect } from "react";

const PROJECT_NAME = "Career Graph";

/**
 * Helper hook allowing any client component or modal to dynamically set a custom document title.
 * e.g., useDocumentTitle("Senior Software Engineer at Stripe")
 */
export function useDocumentTitle(title?: string | null) {
  useEffect(() => {
    if (!title) return;
    document.title = `${title} - ${PROJECT_NAME}`;
  }, [title]);
}
