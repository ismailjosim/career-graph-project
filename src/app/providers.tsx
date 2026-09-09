"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { TokensProvider } from "@/context/tokens-context";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TokensProvider>
        {children}
        <Toaster />
      </TokensProvider>
    </ThemeProvider>
  );
}
