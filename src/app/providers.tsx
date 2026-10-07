"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { PageTitleManager } from "@/components/PageTitleManager";
import { Toaster } from "@/components/ui/sonner";
import { TokensProvider } from "@/context/tokens-context";

// Filter out next-themes benign React 19 script tag warning in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes(
        "Encountered a script tag while rendering React component",
      )
    ) {
      return;
    }
    origError.apply(console, args);
  };
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TokensProvider>
        <PageTitleManager />
        {children}
        <Toaster />
      </TokensProvider>
    </ThemeProvider>
  );
}
