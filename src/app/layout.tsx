import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Career Graph - Job Application Tracker",
  description: "Track your job applications and manage your career journey",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
