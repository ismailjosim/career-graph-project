"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TokensProvider } from "@/context/tokens-context";

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
