import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_APP_URL
    ? new URL(process.env.NEXT_PUBLIC_APP_URL)
    : undefined,
  title: {
    default: "Career Graph - Job Application Tracker",
    template: "%s | Career Graph",
  },
  description:
    "Intelligent job application tracker. Organize your job search, analyze resume-to-job match with AI, craft tailored cover letters, and level up your career.",
  applicationName: "Career Graph",
  keywords: [
    "Career Graph",
    "job tracker",
    "job application tracker",
    "AI resume analyzer",
    "job fit analysis",
    "cover letter generator",
    "career management",
    "job search dashboard",
  ],
  authors: [{ name: "Career Graph" }],
  creator: "Career Graph",
  publisher: "Career Graph",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Career Graph",
    title: "Career Graph - Job Application Tracker",
    description:
      "Track your job search, match resumes against job descriptions with AI, and accelerate your career.",
    images: [
      {
        url: "/career-graph.png",
        width: 1024,
        height: 1077,
        alt: "Career Graph Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Graph - Job Application Tracker",
    description:
      "Track your job search, match resumes against job descriptions with AI, and accelerate your career.",
    images: ["/career-graph.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
